import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApplicationLog } from './application_log.interface';

@Injectable()
export class ApplicationLogService {
  constructor(@InjectModel('ApplicationLog') private applicationLogModel: Model<ApplicationLog>) {}

  findAll(): Promise<ApplicationLog[]> {
    return this.applicationLogModel.find({}).exec();
  }

  find(filter = {}, projection: string | {} = '', pagination = {}, lean = true): Promise<ApplicationLog[] | null> {
    return this.applicationLogModel
      .find(filter, projection, pagination)
      .lean(lean)
      .exec();
  }
}
