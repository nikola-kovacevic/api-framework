import { Request, Response } from 'express';

import { LoggerService } from './../services/logger/logger.service';

export function loggerMiddleware(req: Request, res: Response, next: () => void): void {
  const logger = new LoggerService('LoggerMiddleware');
  const send = res.send;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  res.send = function(...args) {
    logger.log(`Responded to request ${req.path} with status code ${res.statusCode}`);
    // tslint:disable-next-line: no-invalid-this
    return send.apply(this, args);
  };
  next();
}
