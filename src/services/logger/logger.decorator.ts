import { Inject } from '@nestjs/common';

export const prefixesForLoggers: string[] = new Array<string>();

export function Logger(prefix = ''): (target: Record<string, number>, key: string | symbol, index?: number) => void {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(`LoggerService${prefix}`);
}
