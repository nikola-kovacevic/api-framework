import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApplicationLogDto } from './application_log.interface';

@Injectable()
export class ApplicationLogService {
  constructor(@InjectModel('ApplicationLog') private applicationLogModel: Model<ApplicationLogDto>) {}

  findAll(): Promise<ApplicationLogDto[]> {
    return this.applicationLogModel.find({}).exec();
  }

  find(filter = {}, projection: string | {} = '', pagination = {}, lean = true): Promise<ApplicationLogDto[] | null> {
    return this.applicationLogModel
      .find(filter, projection, pagination)
      .lean(lean)
      .exec();
  }
}
