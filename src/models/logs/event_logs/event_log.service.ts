import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventLog } from './event_log.interface';

@Injectable()
export class EventLogService {
  constructor(@InjectModel('EventLog') private eventLogModel: Model<EventLog>) {}

  async addLog(eventLog: EventLog): Promise<EventLog | null> {
    return this.eventLogModel.create(eventLog);
  }

  findAll(): Promise<EventLog[]> {
    return this.eventLogModel.find({}).exec();
  }

  find(filter = {}, projection: string | {} = '', pagination = {}, lean = true): Promise<EventLog[] | null> {
    return this.eventLogModel
      .find(filter, projection, pagination)
      .lean(lean)
      .exec();
  }
}
