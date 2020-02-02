import { Injectable, NestMiddleware } from '@nestjs/common';

import { Entropy } from 'entropy-string';
import { Request, Response } from 'express';

import { EventLogService } from './../models/logs/event_logs/event_log.service';
import { LoggerService } from './../services/logger/logger.service';
import { PerformanceService } from './../services/performance/performance.service';

const generateCorrelation = (correlation: string | undefined): string => {
  if (correlation && typeof correlation === 'string') {
    return correlation.trim();
  }
  const entropy = new Entropy({ total: 1e6, risk: 1e9 });
  return entropy.string();
};

const getIp = (req: Request): string => {
  const ip = req.get('x-forwarded-for') || req.connection.remoteAddress || req.socket.remoteAddress;
  return String(ip);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMessage = (args: [any?]): string => {
  if (args.length) {
    try {
      const data = JSON.parse(args[0]);
      return data.message || '';
    } catch (ex) {
      return '';
    }
  }
};

const hideSensitiveData = (data: {}): {} => {
  const request = { ...data };

  return Object.keys(request).reduce((sanitized, key) => {
    const matches = key.match(new RegExp(/(?:password)|(?:token)|(?:authorization)/gi));
    if (matches && request[key]) {
      sanitized[key] = '**********';
    } else if (matches && !request[key]) {
      sanitized[key] = '';
    } else {
      sanitized[key] = request[key];
    }
    return sanitized;
  }, {});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUser = (user: any): {} | { email: string; _id: string } => {
  if (user && user._id) {
    return { email: user.email, _id: user._id };
  }
  return {};
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private eventLogService: EventLogService, private loggerService: LoggerService) {}

  use(req: Request, res: Response, next: () => void): void {
    const send = res.send;

    res.locals.correlation = Object.freeze(generateCorrelation(req.get('Request-Correlation')));
    res.locals.performance = new PerformanceService(res.locals.correlation);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    res.send = (...args) => {
      this.eventLogService
        .addLog({
          correlation: res.locals.correlation,
          client: {
            ip: getIp(req),
            user: getUser(req.user),
          },
          request: {
            url: req.originalUrl,
            method: req.method,
            body: hideSensitiveData(req.body),
            query: hideSensitiveData(req.query),
            params: hideSensitiveData(req.params),
            headers: hideSensitiveData(req.headers),
          },
          response: {
            status: res.statusCode,
            message: getMessage(args),
          },
          debug: res.locals.debug || {},
          duration: res.locals.performance.measure(),
        })
        .catch(ex => this.loggerService.error(`Exception was thrown while trying to store event log`, ex));

      return send.apply(res, args);
    };
    next();
  }
}
