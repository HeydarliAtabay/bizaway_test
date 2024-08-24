import mongoose, { Document, Schema } from 'mongoose';
import { ITrip } from '../models/Trip';

const tripSchema = new Schema<ITrip>({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cost: { type: Number, required: true },
    duration: { type: Number, required: true },
    type: { type: String, enum: ['car', 'plane', 'train'], required: true },
    display_name: { type: String, required: true },
  });
  
  const Trip = mongoose.model<ITrip>('Trip', tripSchema);
  
  export default Trip;
  