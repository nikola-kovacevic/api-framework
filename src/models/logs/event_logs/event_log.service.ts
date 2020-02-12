import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventLogDto } from './event_log.interface';

@Injectable()
export class EventLogService {
  constructor(@InjectModel('EventLog') private eventLogModel: Model<EventLogDto>) {}

  async addLog(eventLog: Partial<EventLogDto>): Promise<EventLogDto | null> {
    return this.eventLogModel.create(eventLog);
  }

  async findAll(): Promise<EventLogDto[]> {
    return this.eventLogModel.find({}).exec();
  }

  async find(
    query = {},
    search = [{}],
    filter = [{}],
    pagination = {},
    sort = { createdAt: 1 },
    projection: string | {} = '-__v',
    lean = true,
  ): Promise<EventLogDto[] | []> {
    return this.eventLogModel
      .find(query, projection, pagination)
      .or(search)
      .and(filter)
      .sort(sort)
      .lean(lean)
      .exec();
  }

  async count(query = {}, search = [{}], filter = [{}]): Promise<number> {
    return this.eventLogModel
      .countDocuments(query)
      .or(search)
      .and(filter)
      .exec();
  }
}
