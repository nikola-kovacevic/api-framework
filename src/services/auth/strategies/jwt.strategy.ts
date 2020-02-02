import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDto } from '../../../models/users/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ENCRYPTION_KEY'),
    });
  }

  async validate(
    user: Pick<UserDto, '_id' | 'email' | 'status' | 'role'>,
  ): Promise<Pick<UserDto, '_id' | 'email' | 'status' | 'role'>> {
    return user;
  }
}
