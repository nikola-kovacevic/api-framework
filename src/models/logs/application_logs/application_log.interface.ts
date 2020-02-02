import { Document } from 'mongoose';

export interface ApplicationLogDto extends Document {
  _id?: string;
  level: string;
  message: string;
  meta?: {};
  hostname?: string;
  timestamp?: Date;
}
