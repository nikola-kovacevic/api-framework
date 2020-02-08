import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from './../../middlewares/auth.middleware';

import { AuthModule } from '../../services/auth/auth.module';

import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule],
  providers: [],
  controllers: [AdminController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(AdminController);
  }
}
