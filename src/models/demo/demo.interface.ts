import { Document } from 'mongoose';

export interface Demo extends Document {
  _id: string;
  name: string;
  value: Record<string, string>;
}
