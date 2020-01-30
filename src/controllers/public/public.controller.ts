import { Body, ConflictException, Controller, Get, Post, Res, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Response } from 'express';
import { Connection } from 'mongoose';

import { CountriesService } from './../../models/countries/countries.service';
import { UserService } from './../../models/users/user.service';
import { LoggerService } from './../../services/logger/logger.service';

import { AuthenticateUser, RegisterUser } from './../../validators/public';

@Controller('public')
export class PublicController {
  logger = new LoggerService('Public');

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly countriesService: CountriesService,
    private readonly userService: UserService,
  ) {}

  @Get('health')
  checkHealth(@Res() res: Response): Response {
    return this.connection.readyState === 1
      ? res.status(200).json({ message: 'APPLICATION AND DATABASE ARE WORKING' })
      : res.status(503).json({ message: 'DATABASE CONNECTION IS NOT WORKING' });
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
  async authenticate(@Body() authenticateUser: AuthenticateUser, @Res() res: Response): Promise<Response> {
    if (!(await this.userService.authenticateUser(authenticateUser))) {
      throw new UnauthorizedException('Wrong email address or password!');
    }

    return res.status(202).json({ authenticated: true });
  }
}
