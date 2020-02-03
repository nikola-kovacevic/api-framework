import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from './../../middlewares/auth.middleware';

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
export class PublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('public/token');
  }
}
