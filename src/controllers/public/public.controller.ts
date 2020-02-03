import { Body, ConflictException, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';
import { Connection } from 'mongoose';

import { User } from '../../decorators/user.decorator';
import { Token } from './../../decorators/token.decorator';

import { CountriesService } from './../../models/countries/countries.service';
import { UserDto } from './../../models/users/user.interface';
import { UserService } from './../../models/users/user.service';

import { AuthService } from './../../services/auth/auth.service';
import { LoggerService } from './../../services/logger/logger.service';

import { AuthenticateUser, RegisterUser } from './../../validators/public';

@Controller('public')
export class PublicController {
  logger = new LoggerService('Public');

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly countriesService: CountriesService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('health')
  checkHealth(@Res() res: Response): Response {
    return this.connection.readyState === 1
      ? res.status(200).json({ message: 'APPLICATION AND DATABASE ARE WORKING' })
      : res.status(503).json({ message: 'MONGODB CONNECTION IS NOT WORKING' });
  }

  @Get('countries')
  async getCountries(@Res() res: Response): Promise<Response> {
    return res.status(200).json({ countries: await this.countriesService.findAll() });
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUser, @Res() res: Response): Promise<Response> {
    const user = await this.userService.createOne(registerUser).catch(err => {
      this.logger.warn(`[Register user]: Exception was raised during creation of user: ${registerUser.email}`, err);
      throw new ConflictException('User with this email address already exists');
    });
    return res.status(201).json({ user });
  }

  @Post('authenticate')
  async authenticate(
    @Body() authenticateUser: AuthenticateUser,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService
      .authenticateUser(authenticateUser)
      .then((authenticatedUser: Pick<UserDto, 'email' | '_id' | 'role'>) => {
        req.user = { email: authenticatedUser.email, _id: authenticatedUser._id };
        return this.authService.signToken(authenticatedUser);
      });

    return res.status(202).json({ token, message: 'Authorization successful' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async refresh(@User() user, @Token() oldToken, @Res() res: Response): Promise<Response> {
    const data = (({ _id, email, role }): Pick<UserDto, 'email' | '_id' | 'role'> => ({ _id, email, role }))(user);

    const token = await this.authService.signToken(data);
    await this.authService.blacklistToken(oldToken, user.exp);

    return res.status(202).json({ message: 'Token refreshed', token });
  }
}
