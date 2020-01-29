import { Document } from 'mongoose';

export interface User extends Document {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  salt?: string;
  status?: string;
  role?: string;
}
