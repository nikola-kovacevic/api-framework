import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventLogDto } from './event_log.interface';

@Injectable()
export class EventLogService {
  constructor(@InjectModel('EventLog') private eventLogModel: Model<EventLogDto>) {}

  async addLog(eventLog: EventLogDto): Promise<EventLogDto | null> {
    return this.eventLogModel.create(eventLog);
  }

  findAll(): Promise<EventLogDto[]> {
    return this.eventLogModel.find({}).exec();
  }

  find(filter = {}, projection: string | {} = '', pagination = {}, lean = true): Promise<EventLogDto[] | null> {
    return this.eventLogModel
      .find(filter, projection, pagination)
      .lean(lean)
      .exec();
  }
}
