import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CountriesSchema } from '../../models/countries/countries.model';
import { CountriesService } from '../../models/countries/countries.service';
import { UserSchema } from './../../models/users/user.model';
import { UserService } from './../../models/users/user.service';
import { PublicController } from './public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Country', schema: CountriesSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [CountriesService, UserService],
  controllers: [PublicController],
})
export class PublicModule {}
