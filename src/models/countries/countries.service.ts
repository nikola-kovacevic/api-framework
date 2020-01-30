import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Country } from './country.interface';

@Injectable()
export class CountriesService {
  constructor(@InjectModel('Country') private countryModel: Model<Country>) {}

  findAll(): Promise<Country[]> {
    return this.countryModel.find({}).exec();
  }
}
