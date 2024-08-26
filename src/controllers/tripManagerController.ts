// Controllers for Managing Trips
import { Request, Response } from 'express';
import { createTrip, getTrips, deleteTrip } from '../services/tripServices';

export const createTripHandler = async (req: Request, res: Response) => {
  try {
    const trip = await createTrip(req.body);
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create trip', error: (error as Error).message });
  }
};

export const getTripsHandler = async (req: Request, res: Response) => {
  try {
    const trips = await getTrips();
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch trips', error: (error as Error).message });
  }
};

export const deleteTripHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await deleteTrip(id);
    if (trip) {
      res.status(200).json({ message: 'Trip deleted successfully' });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete trip', error: (error as Error).message });
  }
};


