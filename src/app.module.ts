import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import * as Joi from '@hapi/joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PublicModule } from './controllers/public/public.module';
import { LoggerModule } from './services/logger/logger.module';

import { LoggerMiddleware } from './middlewares/logger.middleware';

import { EventLogSchema } from './models/logs/event_logs/event_log.model';
import { EventLogService } from './models/logs/event_logs/event_log.service';

const buildConnectionString = (config: ConfigService): string => {
  const authenticationDatabase = config.get<string>('MONGO_AUTH_DB');
  const authSource = authenticationDatabase ? `?authSource=${authenticationDatabase}` : '';
  return `mongodb://${config.get<string>('MONGO_URL')}/${config.get<string>('MONGO_DB_NAME')}${authSource}`;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().required(),
        MONGO_URL: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_AUTH_DB: Joi.string().optional(),
        ENCRYPTION_KEY: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: buildConnectionString(config),
        user: config.get<string>('MONGO_USER'),
        pass: config.get<string>('MONGO_PASSWORD'),
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'EventLog', schema: EventLogSchema }]),
    LoggerModule.forRoot(),
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventLogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
