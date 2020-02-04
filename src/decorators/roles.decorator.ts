/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]): ((target: object, key?: any, descriptor?: any) => any) =>
  SetMetadata('roles', roles);
