import { Injectable } from '@nestjs/common';
import { Logger } from './services/logger/logger.decorator';
import { LoggerService } from './services/logger/logger.service';

@Injectable()
export class AppService {
  constructor(@Logger('AppService') private logger: LoggerService) {}

  getHello(): string {
    this.logger.log('Hello World was called');
    return 'Hello World!';
  }
}
