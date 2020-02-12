import { Document } from 'mongoose';

export interface EventLogDto extends Document {
  correlation: string;
  client: {
    ip: string;
    user?: {
      _id?: string;
      email?: string;
    };
  };
  request: {
    url: string;
    method: string;
    body: {};
    query: {};
    params: {};
    headers: {};
  };
  response: {
    status: number;
    message?: string;
  };
  debug: {};
  duration: number;
  createdAt?: Date;
}
