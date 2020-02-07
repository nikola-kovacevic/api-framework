import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from './../../middlewares/auth.middleware';

import { ApplicationLogSchema } from './../../models/logs/application_logs/application_log.model';
import { ApplicationLogService } from './../../models/logs/application_logs/application_log.service';
import { EventLogSchema } from './../../models/logs/event_logs/event_log.model';
import { EventLogService } from './../../models/logs/event_logs/event_log.service';

import { AuthModule } from '../../services/auth/auth.module';

import { LogsController } from './logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'EventLog', schema: EventLogSchema }]),
    MongooseModule.forFeature([{ name: 'ApplicationLog', schema: ApplicationLogSchema }]),
    AuthModule,
  ],
  providers: [ApplicationLogService, EventLogService],
  controllers: [LogsController],
})
export class LogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(LogsController);
  }
}
