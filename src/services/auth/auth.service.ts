import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CacheService } from './../cache/cache.service';
import { LoggerService } from './../logger/logger.service';

import { UserDto } from './../../models/users/user.interface';
import { UserService } from './../../models/users/user.service';

@Injectable()
export class AuthService {
  logger = new LoggerService('AuthService');

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async authenticateUser(
    user: Pick<UserDto, 'email' | 'password'>,
  ): Promise<Pick<UserDto, '_id' | 'email' | 'role'> | Error> {
    const foundUser = await this.userService.findOne({ email: user.email, status: 'ACTIVE' });
    if (!foundUser) {
      this.logger.warn(`User ${user.email} not found`);
      throw new UnauthorizedException('Wrong email address or password!');
    }

    const isPasswordCorrect = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordCorrect) {
      this.logger.warn(`User ${user.email} entered wrong password`);
      throw new UnauthorizedException('Wrong email address or password!');
    }

    return (({ _id, email, role }): Pick<UserDto, '_id' | 'email' | 'role'> => ({
      _id,
      email,
      role,
    }))(foundUser);
  }

  async signToken(user: Pick<UserDto, '_id' | 'email' | 'role'>): Promise<string> {
    return this.jwtService.sign(user);
  }

  readToken(token: string): string | { [key: string]: string } {
    const decoded = this.jwtService.decode(token);
    return decoded;
  }

  async blacklistToken(token: string, tokenExpirationDate?: number): Promise<void> {
    const ttl = tokenExpirationDate ? Math.ceil(tokenExpirationDate - Date.now() / 1000) : 86400; // TTL set to token expiration time or to 24h
    await CacheService.get(token, () => Promise.resolve(`[${Date.now()}] TOKEN BLACKLISTED`), ttl);
  }
}
