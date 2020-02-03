import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

import { Request, Response } from 'express';

import { AuthService } from './../services/auth/auth.service';
import { CacheService } from './../services/cache/cache.service';

const getToken = (header: string | undefined): string => {
  if (!header || typeof header !== 'string' || !header.length) {
    return '';
  }

  const token = header.split(' ')[1];
  if (!token || !token.length) {
    return '';
  }

  return token.trim();
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void): Promise<void> {
    const bearerToken = req.get('authorization');
    const token = getToken(bearerToken);
    if (!token) {
      throw new UnauthorizedException('Authorization was unsuccessful. No token provided.');
    }

    const exists = await CacheService.exists(bearerToken);

    if (exists) {
      // Safe to store user in request, as token has to be known to the system to get here.
      req.user = this.authService.readToken(token);
      throw new UnauthorizedException('Authorization was unsuccessful. Invalid token provided.');
    }
    next();
  }
}
