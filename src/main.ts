import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { RotatingFileStream } from 'rotating-file-stream';

import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';

import { AppModule } from './app.module';

import { FileService } from './services/file/file.service';
import { LoggerModule } from './services/logger/logger.module';
import { LoggerService } from './services/logger/logger.service';

import { GlobalExceptionsFilter } from './exception.filter';

const accessLogStream = (): RotatingFileStream => {
  const fileService = new FileService();
  fileService.createDirectoryIfNoneExists(path.join(__dirname, './logs', 'access'));
  return fileService.getRotatingFileStream(path.join(__dirname, 'logs/access', 'access.log'));
};

const getErrorData = (error: { message?: {}; stack?: {} }): { ERROR; STACK? } => {
  if (error instanceof Error) {
    return { ERROR: error.message, STACK: error.stack };
  } else if (typeof error === 'string') {
    return { ERROR: error };
  }

  return { ERROR: JSON.stringify(error) };
};

async function bootstrap(): Promise<void> {
  const logger = new LoggerService('ApplicationLoader');
  const app = await NestFactory.create(AppModule, { cors: true, logger });
  app.useLogger(app.get(LoggerModule));

  const configService = app.get<ConfigService>(ConfigService);
  const port = parseInt(configService.get('PORT'), 10);

  if (configService.get('NODE_ENV') === 'development') {
    mongoose.set('debug', (collection, method, ...args) => {
      const loggerService = new LoggerService('Mongoose');
      loggerService.debug(
        `Method [${method}] executed on collection [${collection}] with arguments ${JSON.stringify(args)}`,
      );
    });
  }

  app.use(morgan('combined', { stream: accessLogStream() }));
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

  app.useGlobalFilters(new GlobalExceptionsFilter());

  await app
    .listen(port)
    .then(() => logger.log(`Application is running on port ${port}`))
    .catch(ex => logger.error('Error on application start', ex));

  process.on('unhandledRejection', error => {
    const { ERROR, STACK } = getErrorData(error);
    logger.error(`Unhandled rejection in application: ${ERROR}`, { ERROR, STACK });
  });

  // TS doesn't recognize process.on('uncaughtException'):
  // Argument of type '"uncaughtException"' is not assignable to parameter of type 'Signals'
  (process as NodeJS.EventEmitter).on('uncaughtException', (exception, origin) => {
    const { ERROR, STACK } = getErrorData(exception);
    logger
      .error(`Unhandled exception in application: ${ERROR}`, { ERROR, STACK, ORIGIN: origin })
      .on('finish', () => process.exit(1));
  });
}
bootstrap().catch(ex => ex);
