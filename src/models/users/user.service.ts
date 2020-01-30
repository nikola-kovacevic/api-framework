import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async authenticateUser(user: Pick<User, 'email' | 'password'>): Promise<boolean | Error> {
    const foundUser = await this.userModel.findOne({ email: user.email, status: 'ACTIVE' }).exec();
    if (!foundUser) {
      throw new UnauthorizedException('Wrong email address or password!');
    }

    return bcrypt.compare(user.password, foundUser.password);
  }

  async createOne(user: User): Promise<User | null> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
    const newUser = { ...user, salt, password };
    return this.userModel.create(newUser);
  }

  async updateOne(user: Partial<User>): Promise<User | null> {
    const newUserData = { ...user };
    if (newUserData.password) {
      newUserData.salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(newUserData.password, newUserData.salt);
    } else {
      delete newUserData.password;
    }

    return this.userModel
      .findOneAndUpdate({ email: user.email }, newUserData, {
        new: true,
        select: '-password -salt -_id -_v -createdAt -updatedAt',
      })
      .exec();
  }
}
