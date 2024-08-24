import { Document } from 'mongoose';

export interface ITrip extends Document {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: 'car' | 'plane' | 'train';
  display_name: string;
}

