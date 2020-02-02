import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CountryDto } from './country.interface';

@Injectable()
export class CountriesService {
  constructor(@InjectModel('Country') private countryModel: Model<CountryDto>) {}

  findAll(): Promise<CountryDto[]> {
    return this.countryModel.find({}).exec();
  }
}
