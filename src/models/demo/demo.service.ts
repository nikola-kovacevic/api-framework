import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Demo } from './demo.interface';

@Injectable()
export class DemoService {
  constructor(@InjectModel('Demo') private demoModel: Model<Demo>) {}

  findAll(): Promise<Demo[]> {
    return this.demoModel.find().exec();
  }

  removeDemo(): Promise<Demo> {
    return this.demoModel.deleteOne({}).exec();
  }

  updateDemo(id: string): Promise<Demo> {
    return this.demoModel.updateOne({ _id: id }, { name: `Named Document - ${Math.random()}` }).exec();
  }

  addDemo(): Promise<Demo> {
    return this.demoModel.create({
      name: `Named Document - ${Math.random()}`,
      value: { id: Math.random(), value: `Value - ${Math.random()}` },
    });
  }
}
