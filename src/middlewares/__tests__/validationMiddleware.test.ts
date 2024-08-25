import express from 'express';
import request from 'supertest'; // Import Supertest
import { validateGetTrips } from '../../middlewares/validateGetTrips'; // Your middleware

const app = express();

app.get('/trips', validateGetTrips, (req, res) => {
  res.status(200).json({ message: 'Trips found' });
});

describe('GET /trips', () => {
  // Use Case: The user does not provide an origin in the request.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      destination: 'MIA',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid query parameters');
  });

  // Use Case: The user does not provide a origin in the request.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      destination: 'MIA',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: '\"origin"\ is required',
      });
  });

  // Use Case: The user does not provide a destination in the request.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'MIA',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: '\"destination"\ is required',
      });
    
  });

  // Use Case: The user provides an invalid origin that is not a 3-letter IATA code.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'MIAMI',
      destination: 'ATL',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: 'Origin must be a 3-letter IATA code.',
      });
    
  });

   // Use Case: The user provides an invalid destination that is not a 3-letter IATA code.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'MIA',
      destination: 'ATALANTA',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: 'Destination must be a 3-letter IATA code.',
      });
    
  });

  // Use Case: The user provides wrong sort-by param, rather than cheapest or fastest.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'MIA',
      destination: 'ATL',
      sort_by: 'direct',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: 'Sort_by must be either \"fastest\" or \"cheapest\".',
      });
    
  });

  // Use Case: The user did not provide any sort-by parameter.
  // Expected Behavior: The controller should return a 400 status code with a validation error message.
  it('should return 400 if origin is missing', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'MIA',
      destination: 'ATL',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: 'Invalid query parameters',
        error: '\"sort_by\" is required',
      });
    
  });

  it('should return 200 for valid query parameters', async () => {
    const response = await request(app).get('/trips').query({
      origin: 'ATL',
      destination: 'MIA',
      sort_by: 'fastest',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trips found');
  });
});
