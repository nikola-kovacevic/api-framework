import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { UserDto } from './user.interface';

interface SanitizedUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  status?: string;
  role?: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDto>) {}

  find(
    query = {},
    search = [{}],
    filter = [{}],
    pagination = {},
    projection: string | {} = '-password -salt -__v',
    lean = true,
  ): Promise<UserDto[] | null> {
    return this.userModel
      .find(query, projection, pagination)
      .or(search)
      .and(filter)
      .lean(lean)
      .exec();
  }

  async count(query = {}, search = [{}], filter = [{}]): Promise<number> {
    return this.userModel
      .countDocuments(query)
      .or(search)
      .and(filter)
      .exec();
  }

  async findOne(query: object, projection: string | {} = '-password -salt', lean = true): Promise<UserDto | null> {
    return this.userModel
      .findOne(query, projection)
      .lean(lean)
      .exec();
  }

  async delete(query: object): Promise<{ deletedCount: number } | null> {
    return this.userModel.deleteOne(query).exec();
  }

  async createOne(user: UserDto): Promise<SanitizedUser | null> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
    const newUser = { ...user, salt, password };
    const createdUser = await this.userModel.create(newUser);

    return (({ _id, name, surname, email, role, status }): SanitizedUser => ({
      _id,
      name,
      surname,
      email,
      role,
      status,
    }))(createdUser);
  }

  async updateOne(query: object, updateObject: Partial<UserDto>): Promise<UserDto | null> {
    const user = { ...updateObject };

    if (user.password) {
      user.salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, user.salt);
    } else {
      delete user.password;
    }

    return this.userModel
      .findOneAndUpdate(query, user, {
        new: true,
        select: '-password -salt -_id -_v -createdAt -updatedAt',
      })
      .exec();
  }
}
