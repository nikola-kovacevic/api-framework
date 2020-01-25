import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';
import * as mongoose from 'mongoose';

import { AppModule } from './app.module';
import { LoggerModule } from './services/logger/logger.module';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true, logger: new LoggerService('ApplicationLoader') });
  app.useLogger(app.get(LoggerModule));
  const configService = app.get<ConfigService>(ConfigService);

  const logger = new LoggerService('Application');
  const port = parseInt(configService.get('PORT')) || 3000;

  if (configService.get('NODE_ENV') === 'development') {
    mongoose.set('debug', (collection, method, ...args) => {
      const logger = new LoggerService('Mongoose');
      logger.debug(`Method [${method}] executed on collection [${collection}] with arguments ${JSON.stringify(args)}`);
    });
  }

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
    .catch(ex => logger.error('Error on application start', ex));
}
bootstrap();
