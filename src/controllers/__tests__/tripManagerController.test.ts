import { Request, Response } from 'express';
import { createTripHandler, getTripsHandler, deleteTripHandler } from '../tripManagerController';
import * as tripServices from '../../services/tripServices';
import { ITripBase } from '../../models/Trip';

jest.mock('../../services/tripServices');

describe('TripController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('createTripHandler', () => {

    // Use Case: Saving a new trip successfully.
    // Expected Behavior: The controller should return a 201 status and the saced trip.
    it('should return 201 and the created trip', async () => {
      const trip: ITripBase = {
        origin: 'ATL',
        destination: 'MIA',
        cost: 100,
        duration: 5,
        type: 'car',
        display_name: 'from ATL to MIA by car',
      };

      req.body = trip;
      (tripServices.createTrip as jest.Mock).mockResolvedValue(trip);

      await createTripHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(trip);
    });

    // Use Case: Failing to create a new trip.
    // Expected Behavior: The controller should return a 400 status with an error message.
    it('should return 400 if creation fails', async () => {
      const errorMessage = 'Failed to create trip';
      (tripServices.createTrip as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await createTripHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to create trip',
        error: errorMessage,
      });
    });
  });

  describe('getTripsHandler', () => {
    // Use Case: Fetching the list of trips successfully.
    // Expected Behavior: The controller should return a 200 status and the list of trips.
    it('should return 200 and the list of trips', async () => {
      const trips: ITripBase[] = [
        { origin: 'ATL', destination: 'MIA', cost: 100, duration: 5, type: 'car', display_name: 'from ATL to MIA by car' },
        { origin: 'JFK', destination: 'LAX', cost: 200, duration: 6, type: 'plane', display_name: 'from JFK to LAX by plane' },
      ];

      (tripServices.getTrips as jest.Mock).mockResolvedValue(trips);

      await getTripsHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(trips);
    });

    // Use Case: Failing to fetch the list of trips.
    // Expected Behavior: The controller should return a 400 status with an error message.
    it('should return 400 if fetching trips fails', async () => {
      const errorMessage = 'Failed to fetch trips';
      (tripServices.getTrips as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getTripsHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch trips',
        error: errorMessage,
      });
    });
  });

  describe('deleteTripHandler', () => {
    
    // Use Case: Deleting a trip successfully.
    // Expected Behavior: The controller should return a 200 status and a success message.
    it('should return 200 and a success message if trip is deleted', async () => {
      const tripId = 'some-trip-id';
      req.params = { id: tripId };
      (tripServices.deleteTrip as jest.Mock).mockResolvedValue(true);

      await deleteTripHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Trip deleted successfully' });
    });

    // Use Case: Trying to delete a non-existent trip.
    // Expected Behavior: The controller should return a 404 status with an error message.
    it('should return 404 if the trip is not found', async () => {
      const tripId = '123456789112345678911234';
      req.params = { id: tripId };
      (tripServices.deleteTrip as jest.Mock).mockResolvedValue(false);

      await deleteTripHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Trip not found' });
    });


    // Use Case: Failing to delete a trip due to an internal error.
    // Expected Behavior: The controller should return a 400 status with an error message.
    it('should return 400 if deletion fails', async () => {
      const tripId = 'some-trip-id';
      req.params = { id: tripId };
      const errorMessage = 'Failed to delete trip';
      (tripServices.deleteTrip as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await deleteTripHandler(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to delete trip',
        error: errorMessage,
      });
    });
  });
});
