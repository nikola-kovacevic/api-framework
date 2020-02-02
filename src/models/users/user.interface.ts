import { Document } from 'mongoose';

export interface UserDto extends Document {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  salt?: string;
  status?: string;
  role?: string;
}
