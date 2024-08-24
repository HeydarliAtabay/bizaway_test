import { Request, Response } from 'express';
import axios from 'axios';
import { Trip } from '../types/trips';

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY is not defined in environment variables');
}
if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables');
  }

export const getDefaultTrips = async (req: Request, res: Response) => {
  const { origin, destination, sort_by } = req.query as { origin: string; destination: string; sort_by: 'fastest' | 'cheapest' };

  try {
    const response = await axios.get<Trip[]>(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: {
        origin,
        destination,
      },
    });

    let trips = response.data;

    if (sort_by === 'fastest') {
      trips = trips.sort((a, b) => a.duration - b.duration);
    } else if (sort_by === 'cheapest') {
      trips = trips.sort((a, b) => a.cost - b.cost);
    }

    res.json(trips);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch trips from external API',
      error: {
        message: error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
      },
    });
  }
};
