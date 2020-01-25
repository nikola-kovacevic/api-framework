/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, transports, createLogger } from 'winston';
import { Entropy } from 'entropy-string';
import 'winston-daily-rotate-file';

const getMetadata = (log: object): [] => {
  const SPLAT: string = Symbol.for('splat') as any; // workaround as TypeScript doesn't allow Symbol to be used as a key
  const metadata = log[SPLAT];
  if (metadata && metadata[0] && Array.isArray(metadata[0])) {
    return metadata[0].map(meta => JSON.stringify(meta, null, 2));
  }
  return [];
};

const getCorrelation = (): string => {
  const entropy = new Entropy({ total: 1e6, risk: 1e9 });
  return entropy.string();
};

const logOutput = format.printf(log => {
  const metadata = log.level !== 'error' ? getMetadata(log) : '';
  const correlation = getCorrelation();
  const intro = `[${log.timestamp}][${correlation}][${log.level}]:`;

  return (
    `${intro} ${log.message}` +
    `${metadata && metadata.length ? `\n${intro} [Metadata]: ${metadata}` : ''}` +
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
  auditFile: `logAuditFile.json`,
  dirname: 'logs',
  format: logFormat,
  handleExceptions: true,
  level: 'warn',
});

const consoleTransport = new transports.Console({
  format: format.combine(format.colorize(), logFormat),
  handleExceptions: true,
  level: 'silly',
});

export const logger = createLogger({
  transports: [consoleTransport, fileTransport],
});
