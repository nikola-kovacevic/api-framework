import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './../../models/users/user.module';

import { CountriesSchema } from '../../models/countries/countries.model';
import { CountriesService } from '../../models/countries/countries.service';

import { PublicController } from './public.controller';

import { AuthModule } from '../../services/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Country', schema: CountriesSchema }]), UserModule, AuthModule],
  providers: [CountriesService],
  controllers: [PublicController],
})
export class PublicModule {}
