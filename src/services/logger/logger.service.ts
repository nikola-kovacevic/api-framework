import { Injectable, Scope, Logger } from '@nestjs/common';
import { logger } from './winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private prefix?: string;

  private format(message: string): string {
    return this.prefix ? `[${this.prefix}] - ${message}` : message;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  log(message: string): void {
    logger.info(this.format(message));
  }

  error(message: string, trace: string): void {
    logger.error(this.format(message), trace);
  }

  warn(message: string): void {
    logger.alert(this.format(message));
  }

  debug(message: string): void {
    logger.debug(this.format(message));
  }

  verbose(message: string): void {
    logger.verbose(this.format(message));
  }
}
