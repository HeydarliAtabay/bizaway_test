// Controllers for Getting, Sorting and Filtering Trips
import { Request, Response } from 'express';
import axios from 'axios';
import { ITripBase } from '../models/Trip';

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_KEY || !API_URL) {
  throw new Error('API_KEY or API_URL are not defined in environment variables');
}

// Controller function to get sorted trips
export const getDefaultTrips = async (req: Request, res: Response) => {
  const { origin, destination, sort_by } = req.query as { origin: string; destination: string; sort_by: 'fastest' | 'cheapest' };

  try {
    //Getting trips from third party API
    const response = await axios.get<ITripBase[]>(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: {
        origin,
        destination,
      },
    });

    let trips = response.data;

    // Sorting based on the given sort_by param
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



// Helper function to validate price range
export const isValidPriceRange = (priceRange: [number, number]): boolean => {
  const [minPrice, maxPrice] = priceRange;
  return minPrice >= 0 && maxPrice >= 0 && minPrice <= maxPrice;
};

// Controller function to get filtered trips
export const getFilteredTrips = async (req: Request, res: Response) => {
  const { origin, destination, price_range, transport_type }=req.query as unknown as {
    origin:string,
    destination:string,
    price_range?:[number,number],
    transport_type?:'train'|'bus'|'flight'
  };

  try {
    //Getting trips from third party API
    const response = await axios.get<ITripBase[]>(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: {
        origin,
        destination,
      },
    });

    let trips = response.data;
    let filtered_trips = trips;

    // Filtering by price_range if it is given correctly
      if (price_range && price_range.length === 2) {
        const [minPrice, maxPrice] = price_range.map((el)=>Number(el));
        if (isValidPriceRange([minPrice, maxPrice])) {

          filtered_trips = filtered_trips.filter(trip => trip.cost >= minPrice && trip.cost <= maxPrice);
        } else {
          return res.status(400).json({
            message: 'Invalid price range.',
          });
        }
      }
      // Filtering by transport type if it is exists
      if (transport_type) {
        filtered_trips = filtered_trips.filter(trip => trip.type === transport_type);
      }
    

    res.json(filtered_trips);
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