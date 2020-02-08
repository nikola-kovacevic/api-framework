import { ConfigService } from '@nestjs/config';

import { CacheOptions } from './cache.interface';

import { LoggerService } from './../logger/logger.service';

import * as Redis from 'ioredis';
import * as util from 'util';

const REDIS_CONFIGURATION = new Map([
  ['maxmemory', '200mb'],
  ['maxmemory-policy', 'allkeys-lru'],
  ['maxmemory-samples', '10'],
]);

const DEFAULT_OPTIONS = {
  host: 'localhost',
  port: 6379,
  password: '',
  reconnectOnError: true,
  db: 0,
  autoResubscribe: true,
};

class Cache {
  private redis: Redis;
  private reconnectAttempt = 0;
  private isRedisAvailable = false;
  private isCacheEnabled = true;

  private logger = new LoggerService('Redis');

  constructor(options: CacheOptions = {}) {
    const connection: CacheOptions = { ...DEFAULT_OPTIONS, ...options };
    this.redis = new Redis(connection);
    this.addEventListeners();
    this.enableMonitoring();
    this.configureRedis();
  }

  async clearCache(): Promise<void> {
    if (this.isRedisAvailable && this.isCacheEnabled) {
      return this.redis.flushdb();
    }
  }

  manageCache(isEnabled: boolean): void {
    this.isCacheEnabled = isEnabled;
  }

  async get(key: string, store: () => Promise<unknown>, ttl?: number): Promise<unknown> {
    if (!(key && this.isRedisAvailable && this.isCacheEnabled)) {
      return store();
    } else if (!(await this.redis.exists(key))) {
      return store()
        .then(value => this.set(key, value, ttl))
        .catch(ex => this.logger.error(`Error: ${ex.message}`, ex));
    }

    return this.redis.type(key).then(type => (type === 'string' ? this.getString(key) : this.getHash(key)));
  }

  async exists(key: string): Promise<boolean | void> {
    if (this.isRedisAvailable && this.isCacheEnabled) {
      const exists = await this.redis.exists(key);
      return exists === 1;
    }
  }

  async delete(key: string): Promise<void> {
    if (this.isRedisAvailable && this.isCacheEnabled && (await this.redis.exists(key))) {
      await this.redis.del(key);
    }
  }

  async deleteKeysWhichStartWith(key: string): Promise<unknown> {
    return this.removeKeys(`${key}*`);
  }

  async deleteKeysWhichContain(key: string): Promise<unknown> {
    return this.removeKeys(`*${key}*`);
  }

  private addEventListeners(): void {
    this.redis.on('connect', () => this.logger.log('Connected to Redis server'));

    this.redis.on('ready', () => {
      this.logger.log('Redis server connection is ready');
      this.reconnectAttempt = 0;
      this.isRedisAvailable = true;
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis server connection was closed');
      this.isRedisAvailable = false;
    });

    this.redis.on('error', async err => {
      this.logger.error('There was an error while connecting to Redis: ', err);
      if (this.reconnectAttempt > 5) {
        return this.redis.disconnect();
      }
    });

    this.redis.on('reconnecting', () => {
      this.logger.log(`Reconnecting to Redis server attempt ${this.reconnectAttempt++}`);
    });

    this.redis.on('end', () => {
      this.logger.warn('Failed to establish Redis server connection, no more reconnection attempts will be made');
    });
  }

  private configureRedis(): void {
    for (const [key, value] of REDIS_CONFIGURATION) {
      this.redis.config('set', key, value);
    }
  }

  private enableMonitoring(): void {
    this.redis.monitor((err, monitor) => {
      if (err) {
        this.logger.error('Error happened while monitoring Redis', err);
      }

      monitor.on('monitor', (time, args, source, database) => {
        this.logger.debug(
          `[${time}]: [Arguments sent to Redis server]: ${util.inspect(args)}`,
          { source },
          { database },
        );
      });
    });
  }

  private async removeKeys(key: string): Promise<unknown> {
    if (this.isRedisAvailable && this.isCacheEnabled) {
      if (!key || typeof key !== 'string') {
        throw new Error('[REDIS][REMOVE KEYS] Key is required, and it has to be a string!');
      }

      const keys = await this.redis.keys(key);
      return this.redis.del(...keys);
    }
  }

  private async getString(key: string): Promise<unknown> {
    return this.redis.get(key);
  }

  private async getHash(key: string): Promise<unknown> {
    const data = await this.redis.hget(key, 'data');
    return JSON.parse(data);
  }

  private async set(key: string, value: unknown, ttl?: number): Promise<unknown> {
    if (!(key && value)) {
      throw new Error(`[REDIS][SET] Key and value are required! Received key: ${key} and value: ${value}`);
    }

    return typeof value === 'object'
      ? this.setHash(key, value, ttl)
      : this.redis.set(key, value, ...(ttl ? ['ex', ttl] : [])).then(() => value);
  }

  private async setHash(key: string, value: unknown, ttl?: number): Promise<unknown> {
    await this.redis.hset(key, 'data', JSON.stringify(value));
    if (ttl) {
      this.redis.expire(key, ttl);
    }

    return value;
  }
}

const config = new ConfigService();
export const CacheService: Cache = new Cache({
  host: config.get('REDIS_HOST'),
  port: config.get('REDIS_PORT'),
});
