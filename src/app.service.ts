import { Injectable } from '@nestjs/common';

import { CacheService } from './services/cache/cache.service';
import { Logger } from './services/logger/logger.decorator';
import { LoggerService } from './services/logger/logger.service';

const baba = (): Promise<unknown> => new Promise(resolve => resolve(Math.random()));

@Injectable()
export class AppService {
  private redis = new CacheService({ host: 'framework-cache', port: 6379, password: undefined });

  constructor(@Logger('AppService') private logger: LoggerService) {}

  async getHello(): Promise<string> {
    let message = 'Hello World! ';

    this.logger.log('Hello World was called');
    await this.redis.get('key1', baba, 20).then(value => (message += value));
    return message;
  }
}
