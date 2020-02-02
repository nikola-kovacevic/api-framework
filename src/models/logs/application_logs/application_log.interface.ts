import { Document } from 'mongoose';

export interface ApplicationLog extends Document {
  _id?: string;
  level: string;
  message: string;
  meta?: {};
  hostname?: string;
  timestamp?: Date;
}
