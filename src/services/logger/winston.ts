import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(
  log => `[${log.timestamp}][${log.level}]: ${log.message} ${log.stack ? '\n[STACK]: ' + log.stack : ''}`,
);

const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH:mm',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  auditFile: `logAuditFile.json`,
  dirname: 'logs',
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
    logFormat,
  ),
  handleExceptions: true,
});

export const logger = winston.createLogger({
  transports: [consoleTransport, fileTransport],
});
