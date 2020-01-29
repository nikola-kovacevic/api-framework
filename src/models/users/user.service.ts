import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  find(filter = {}, projection: string | {} = '', pagination = {}, lean = true): Promise<User[] | null> {
    return this.userModel
      .find(filter, projection, pagination)
      .lean(lean)
      .exec();
  }

  findOne(query, lean = true): Promise<User | null> {
    return this.userModel
      .findOne(query)
      .lean(lean)
      .exec();
  }

  async createOne(user: User): Promise<User | null> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
    const newUser = { ...user, salt, password };
    return this.userModel.create(newUser);
  }
}
