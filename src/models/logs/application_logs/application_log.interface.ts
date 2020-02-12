import { Document } from 'mongoose';

export interface ApplicationLogDto extends Document {
  level: string;
  message: string;
  meta?: {};
  hostname?: string;
  timestamp?: Date;
}
