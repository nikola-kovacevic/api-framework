import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CacheService } from './../../services/cache/cache.service';
import { CountryDto } from './country.interface';

@Injectable()
export class CountriesService {
  constructor(@InjectModel('Country') private countryModel: Model<CountryDto>) {}

  findAll(): Promise<CountryDto[] | unknown> {
    return CacheService.get('countries', () => this.countryModel.find({}).exec());
  }
}
