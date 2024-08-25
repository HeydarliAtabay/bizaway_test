import { ITripBase } from '../../models/Trip';
import Trip from '../../schemas/Trip';
import { createTrip, getTrips, deleteTrip } from '../../services/tripServices';

jest.mock('../../schemas/Trip');
const mockedTripModel = Trip as jest.Mocked<typeof Trip>;

describe('Trip Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    it('should create and save a new trip', async () => {
      const tripData: ITripBase = {
        origin: 'ATL',
        destination: 'MIA',
        cost: 150,
        duration: 3,
        type: 'car',
        display_name: 'Atlanta to Miami',
      };

      const savedTrip = {
        ...tripData,
        _id: 'mockedId',
        save: jest.fn().mockResolvedValue(tripData), 
      } as any;

      mockedTripModel.prototype.save.mockResolvedValueOnce(savedTrip);

      const result = await createTrip(savedTrip);

      expect(mockedTripModel).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedTrip);
    });

    it('should throw an error if the trip could not be saved', async () => {
      const tripData: ITripBase = {
        origin: 'ATL',
        destination: 'MIA',
        cost: 150,
        duration: 3,
        type: 'car',
        display_name: 'Atlanta to Miami',
      };

      mockedTripModel.prototype.save.mockRejectedValueOnce(new Error('Save failed'));

      await expect(createTrip(tripData as any)).rejects.toThrow('Save failed');
    });
  });

  describe('getTrips', () => {
    it('should return a list of trips', async () => {
      const trips: ITripBase[] = [
        { origin: 'ATL', destination: 'MIA', cost: 150, duration: 3, type: 'car', display_name: 'Trip 1' },
        { origin: 'LAX', destination: 'SFO', cost: 200, duration: 1, type: 'plane', display_name: 'Trip 2' },
      ];

      mockedTripModel.find.mockResolvedValueOnce(trips as any);

      const result = await getTrips();

      expect(mockedTripModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(trips);
    });

    it('should return an empty array if no trips are found', async () => {
      mockedTripModel.find.mockResolvedValueOnce([]);

      const result = await getTrips();

      expect(mockedTripModel.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('deleteTrip', () => {
    it('should delete a trip by ID and return the deleted trip', async () => {
      const tripId = 'mockedId';
      const trip = { origin: 'ATL', destination: 'MIA', cost: 150, duration: 3, type: 'car', display_name: 'Trip 1' };

      mockedTripModel.findByIdAndDelete.mockResolvedValueOnce(trip as any);

      const result = await deleteTrip(tripId);

      expect(mockedTripModel.findByIdAndDelete).toHaveBeenCalledWith(tripId);
      expect(result).toEqual(trip);
    });

    it('should return null if the trip does not exist', async () => {
      const tripId = 'nonexistentId';

      mockedTripModel.findByIdAndDelete.mockResolvedValueOnce(null);

      const result = await deleteTrip(tripId);

      expect(mockedTripModel.findByIdAndDelete).toHaveBeenCalledWith(tripId);
      expect(result).toBeNull();
    });

    it('should throw an error if deletion fails', async () => {
      const tripId = 'mockedId';

      mockedTripModel.findByIdAndDelete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(deleteTrip(tripId)).rejects.toThrow('Delete failed');
    });
  });
});
