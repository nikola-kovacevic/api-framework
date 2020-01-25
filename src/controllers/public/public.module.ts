import { DemoService } from './../../models/demo/demo.service';
import { DemoSchema } from './../../models/demo/demo.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CountriesSchema } from '../../models/countries/countries.model';
import { CountriesService } from '../../models/countries/countries.service';
import { PublicController } from './public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Country', schema: CountriesSchema },
      { name: 'Demo', schema: DemoSchema },
    ]),
  ],
  providers: [CountriesService, DemoService],
  controllers: [PublicController],
})
export class PublicModule {}
