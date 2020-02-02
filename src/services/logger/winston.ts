/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config';

import { Entropy } from 'entropy-string';
import { createLogger, format, transports } from 'winston';
import { MongoDB } from 'winston-mongodb';

import * as path from 'path';

import 'winston-daily-rotate-file';

const SPLAT: string = Symbol.for('splat') as any; // workaround as TypeScript doesn't allow Symbol to be used as a key

const buildConnectionString = (): string => {
  const config = new ConfigService();
  const authenticationDatabase = config.get('MONGO_AUTH_DB');
  const authSource = authenticationDatabase ? `?authSource=${authenticationDatabase}` : '';
  return `mongodb://${config.get('MONGO_USER')}:${config.get('MONGO_PASSWORD')}@${config.get('MONGO_URL')}/${config.get(
    'MONGO_DB_NAME',
  )}${authSource}`;
};

const getMetadata = (log: object): [] => {
  const metadata = log[SPLAT];
  return metadata && metadata[0] ? metadata[0] : [];
};

const getCorrelation = (): string => {
  const entropy = new Entropy({ total: 1e6, risk: 1e9 });
  return entropy.string();
};

const printMetadata = (metadata: {} | string): string =>
  typeof metadata === 'string' ? metadata : JSON.stringify(metadata);

const logOutput = format.printf(log => {
  log.metadata = getMetadata(log);
  const correlation = getCorrelation();
  const intro = `[${log.timestamp}][${correlation}][${log.level}]:`;

  return (
    `${intro} ${log.message}` +
    `${log.metadata && log.metadata.length ? `\n${intro} [Metadata]: ${printMetadata(log.metadata)}` : ''}` +
    `${log.stack ? `\n${intro} [Stacktrace]: ${log.stack}` : ''}`
  );
});

const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.errors({ stack: true }),
  logOutput,
);

const fileTransport = new transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH:mm',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  auditFile: path.join(__dirname, '../../logs', 'logAuditFile.json'),
  dirname: path.join(__dirname, '../../logs', 'application'),
  handleExceptions: true,
  level: 'debug',
});

const consoleTransport = new transports.Console({
  format: format.combine(format.colorize(), logFormat),
  handleExceptions: true,
  level: 'silly',
});

const mongoTransport = new MongoDB({
  db: buildConnectionString(),
  storeHost: true,
  decolorize: true,
  level: 'debug',
  collection: 'applicationlogs',
  expireAfterSeconds: 864000, // 10 days retention
  metaKey: 'metadata',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

export const logger = createLogger({
  format: logFormat,
  transports: [consoleTransport, fileTransport, mongoTransport],
});
