import { logger } from './winston';
import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private prefix?: string;

  private formattedMessage(message: string): string {
    return this.prefix ? `[${this.prefix}] - ${message}` : message;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  log(message: string): void {
    logger.info(this.formattedMessage(message));
  }

  error(message: string, trace: string): void {
    logger.error(this.formattedMessage(message), trace);
  }

  warn(message: string): void {
    logger.alert(this.formattedMessage(message));
  }

  debug(message: string): void {
    logger.debug(this.formattedMessage(message));
  }

  verbose(message: string): void {
    logger.verbose(this.formattedMessage(message));
  }
}
