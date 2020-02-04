import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';

import { Response } from 'express';
import { Connection } from 'mongoose';

import { User } from '../../decorators/user.decorator';
import { Token } from './../../decorators/token.decorator';

import { UserService } from './../../models/users/user.service';

import { AuthService } from './../../services/auth/auth.service';
import { LoggerService } from './../../services/logger/logger.service';

@Controller('user-management')
@UseGuards(AuthGuard('jwt'))
export class UserManagementController {
  logger = new LoggerService('Public');

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('user/logout')
  async logout(@User() user, @Token() oldToken, @Res() res: Response): Promise<Response> {
    await this.authService.blacklistToken(oldToken, user.exp);
    return res.status(202).json({ message: 'Log out was successful' });
  }

  @Get('users')
  async getUsers(@Res() res: Response): Promise<Response> {
    return res.status(200).json({ users: await this.userService.find({}) });
  }
}
