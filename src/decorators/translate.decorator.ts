import { createParamDecorator } from '@nestjs/common';

import { LoggerService } from './../services/logger/logger.service';

const fallback = (key: string): string => {
  const logger = new LoggerService('TranslationFallback');
  logger.warn(`Translation service doesn't exist on request object. Tried to translate key: ${key}`);
  return key;
};

export const Translate = createParamDecorator((data: string, req) => (req.__ ? req.__ : fallback));
