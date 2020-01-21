import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { LoggerModule } from './services/logger/logger.module';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true, logger: false });
  app.useLogger(app.get(LoggerModule));
  const configService = app.get<ConfigService>(ConfigService);

  const port = parseInt(configService.get('PORT')) || 3000;
  const logger = new LoggerService();
  logger.setPrefix('APPLICATION');

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

  await app
    .listen(port)
    .then(() => logger.log(`Application is running on port ${port}`))
    .catch(ex => logger.error(`Error on application start: ${JSON.stringify(ex)}`, ex.trace));
}
bootstrap();
