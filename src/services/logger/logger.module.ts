import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createLoggerProviders } from './logger.providers';
import { LoggerService } from './logger.service';

export class LoggerModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders();
    return {
      module: LoggerModule,
      providers: [LoggerService, ConfigService, ...prefixedLoggerProviders],
      exports: [LoggerService, ...prefixedLoggerProviders],
    };
  }
}
