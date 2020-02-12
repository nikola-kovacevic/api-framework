import { Document } from 'mongoose';

export interface UserDto extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  salt?: string;
  status?: string;
  role?: string;
}
