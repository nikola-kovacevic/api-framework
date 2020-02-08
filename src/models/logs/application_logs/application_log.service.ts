import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApplicationLogDto } from './application_log.interface';

@Injectable()
export class ApplicationLogService {
  constructor(@InjectModel('ApplicationLog') private applicationLogModel: Model<ApplicationLogDto>) {}

  async findAll(): Promise<ApplicationLogDto[]> {
    return this.applicationLogModel.find({}).exec();
  }

  async find(
    query = {},
    search = [{}],
    filter = [{}],
    pagination = {},
    sort = { timestamp: 1 },
    projection: string | {} = '-__v',
    lean = true,
  ): Promise<ApplicationLogDto[] | []> {
    return this.applicationLogModel
      .find(query, projection, pagination)
      .or(search)
      .and(filter)
      .sort(sort)
      .lean(lean)
      .exec();
  }

  async count(query = {}, search = [{}], filter = [{}]): Promise<number> {
    return this.applicationLogModel
      .countDocuments(query)
      .or(search)
      .and(filter)
      .exec();
  }
}
