import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from './../../middlewares/auth.middleware';

import { UserModule } from './../../models/users/user.module';

import { AuthModule } from '../../services/auth/auth.module';

import { UserManagementController } from './user-management.controller';

@Module({
  imports: [UserModule, AuthModule],
  providers: [],
  controllers: [UserManagementController],
})
export class UserManagementModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(UserManagementController);
  }
}
