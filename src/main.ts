import { LoggerModule } from './services/logger/logger.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true, logger: false });
  app.useLogger(app.get(LoggerModule));
  const configService = app.get<ConfigService>(ConfigService);

  const port = parseInt(configService.get('PORT')) || 3000;

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  app.setGlobalPrefix('v1');

  await app.listen(port);
}
bootstrap();
