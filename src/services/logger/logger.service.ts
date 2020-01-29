/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, Scope } from '@nestjs/common';
import { logger } from './winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private prefix?: string;

  constructor(prefix?: string) {
    super();
    this.prefix = prefix;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  error(message: any, trace?: string): void {
    logger.error(this.format(message), trace);
  }

  warn(message: any, ...meta: any): void {
    logger.warn(this.format(message), meta);
  }

  log(message: any, ...meta: any): void {
    logger.info(this.format(message), meta);
  }

  http(message: any, ...meta: any): void {
    logger.http(this.format(message), meta);
  }

  verbose(message: any, ...meta: any): void {
    logger.verbose(this.format(message), meta);
  }

  debug(message: any, ...meta: any): void {
    logger.debug(this.format(message), meta);
  }

  silly(message: any, ...meta: any): void {
    logger.silly(this.format(message), meta);
  }

  private format(message: any): string {
    return this.prefix ? `[${this.prefix}] - ${this.normalize(message)} ` : this.normalize(message) + ' ';
  }

  private normalize(message: any): string {
    return message && typeof message === 'string'
      ? message
      : `${typeof message}:\n${JSON.stringify(message, undefined, 2)}`;
  }
}
