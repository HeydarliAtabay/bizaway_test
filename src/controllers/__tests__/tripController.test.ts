import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import { Request, Response } from 'express';
import axios from 'axios';
import { getDefaultTrips, getFilteredTrips } from '../tripsController';
import { ITripBase } from '../../models/Trip';
import request from 'supertest';


const app = express();

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getDefaultTrips', () => {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;


  beforeAll(() => {
    process.env.API_URL = API_URL;
    process.env.API_KEY = API_KEY;
  });

  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      query: {
        origin: 'ATL',
        destination: 'MIA',
        sort_by:'fastest'
      },
    };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = {
      status: statusMock,
      json: jsonMock,
    };
    mockedAxios.get.mockClear();
  });


  // Use Case: The user requests trips sorted by the fastest travel time.
  // Expected Behavior: The controller should return the trips sorted in ascending order by duration.
  it('should return sorted trips by fastest when sort_by is fastest', async () => {
    const trips: ITripBase[] = [
      { origin: 'ATL', destination: 'MIA', cost: 100, duration: 3, type: 'car', display_name: 'Trip 1' },
      { origin: 'ATL', destination: 'MIA', cost: 120, duration: 2, type: 'plane', display_name: 'Trip 2' },
    ];

    req.query!.sort_by = 'fastest'; 

    mockedAxios.get.mockResolvedValueOnce({ data: trips });

    await getDefaultTrips(req as Request, res as Response);

    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: {
        origin: 'ATL',
        destination: 'MIA',
      },
    });

    const expectedTrips = [trips[1], trips[0]].sort((a, b) => a.duration - b.duration);
    expect(jsonMock).toHaveBeenCalledWith(expectedTrips);
  });

  // Use Case: The user requests trips sorted by the cheapest cost.
  // Expected Behavior: The controller should return the trips sorted in ascending order by cost.
  it('should return sorted trips by cheapest when sort_by is cheapest', async () => {
    const trips: ITripBase[] = [
      { origin: 'ATL', destination: 'MIA', cost: 120, duration: 3, type: 'car', display_name: 'Trip 1' },
      { origin: 'ATL', destination: 'MIA', cost: 100, duration: 2, type: 'plane', display_name: 'Trip 2' },
    ];

    req.query!.sort_by = 'cheapest'; 

    mockedAxios.get.mockResolvedValueOnce({ data: trips });

    await getDefaultTrips(req as Request, res as Response);

    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: {
        origin: 'ATL',
        destination: 'MIA',
      },
    });

    const expectedTrips = [trips[1], trips[0]].sort((a, b) => a.cost - b.cost);

    expect(jsonMock).toHaveBeenCalledWith(expectedTrips);
  });

  // Use Case: The external API request fails.
  // Expected Behavior: The controller should return a 500 status code with an error message and details.
  it('should return a 500 error when the API request fails', async () => {
    const errorMessage = 'API request failed';
    mockedAxios.get.mockRejectedValueOnce({
      message: errorMessage,
      response: {
        status: 500,
        headers: {},
        data: 'Internal Server Error',
      },
    });

    await getDefaultTrips(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Failed to fetch trips from external API',
      error: {
        message: errorMessage,
        status: 500,
        headers: {},
        data: 'Internal Server Error',
      },
    });
  });
});


app.get('/api/v1/trips/filtered', getFilteredTrips);

describe('GET /api/v1/trips/filtered', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Use Case: The user does not provide the origin in the request.
  // Expected Behavior: The controller should return a 500 status code with a validation error message.
  it('should return 500 if origin is missing', async () => {
    const response = await request(app).get('/api/v1/trips/filtered').query({
      destination: 'MIA',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch trips from external API');
  });

  // Use Case: The user does not provide the destination in the request.
  // Expected Behavior: The controller should return a 500 status code with a validation error message.
  it('should return 500 if destination is missing', async () => {
    const response = await request(app).get('/api/v1/trips/filtered').query({
      origin: 'MIA',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch trips from external API');
  });

  // Use Case: The user provides an invalid price range.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if price_range is invalid', async () => {

    mockedAxios.get.mockResolvedValueOnce({ data: [] });
  
    const response = await request(app).get('/api/v1/trips/filtered').query({
      origin: 'MIA',
      destination: 'ATL',
      price_range: [-10, 10],
    });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid price range.');
  });
  // Use Case: The user provides a valid price range but no other filters.
  // Expected Behavior: The controller should return a 200 status code and the correct filtered trips.
  it('should return 200 and filter trips based on price range', async () => {
    const trips = [
      { origin: 'MIA', destination: 'ATL', cost: 150, duration: 120, type: 'flight', id: '1', display_name: 'Trip 1' },
      { origin: 'MIA', destination: 'ATL', cost: 250, duration: 150, type: 'flight', id: '2', display_name: 'Trip 2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: trips });

    const response = await request(app).get('/api/v1/trips/filtered').query({
      origin: 'MIA',
      destination: 'ATL',
      price_range: [100, 200],
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { origin: 'MIA', destination: 'ATL', cost: 150, duration: 120, type: 'flight', id: '1', display_name: 'Trip 1' },
    ]);
  });

  // Use Case: The user provides a transport type filter.
  // Expected Behavior: The controller should return a 200 status code and the correct filtered trips.
  it('should return 200 and filter trips based on transport type', async () => {
    const trips = [
      { origin: 'MIA', destination: 'ATL', cost: 150, duration: 120, type: 'bus', id: '1', display_name: 'Trip 1' },
      { origin: 'MIA', destination: 'ATL', cost: 200, duration: 150, type: 'flight', id: '2', display_name: 'Trip 2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: trips });

    const response = await request(app).get('/api/v1/trips/filtered').query({
      origin: 'MIA',
      destination: 'ATL',
      transport_type: 'flight',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { origin: 'MIA', destination: 'ATL', cost: 200, duration: 150, type: 'flight', id: '2', display_name: 'Trip 2' },
    ]);
  });

  // Use Case: The external API request fails.
  // Expected Behavior: The controller should return a 500 status code and an error message.
  it('should return 500 if the external API request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const response = await request(app).get('/api/v1/trips/filtered').query({
      origin: 'MIA',
      destination: 'ATL',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch trips from external API');
  });
});