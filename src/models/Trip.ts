import { Document } from 'mongoose';

export interface ITripBase {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: 'car' | 'plane' | 'train';
  display_name: string;
}

export interface ITrip extends ITripBase,Document {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: 'car' | 'plane' | 'train';
  display_name: string;
}

