//Simple services for Trip
import { ITrip } from '../models/Trip';
import Trip from '../schemas/Trip';

export const createTrip = async (tripData: ITrip) => {
  const trip = new Trip(tripData);
  return trip.save();
};

export const getTrips = async () => {
  return Trip.find();
};

export const deleteTrip = async (id: string) => {
  return Trip.findByIdAndDelete(id);
};
