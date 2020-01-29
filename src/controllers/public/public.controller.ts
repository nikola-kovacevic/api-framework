import { Controller, Get, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Response } from 'express';
import { Connection } from 'mongoose';

import { CountriesService } from './../../models/countries/countries.service';
import { User } from './../../models/users/user.interface';
import { UserService } from './../../models/users/user.service';
import { LoggerService } from './../../services/logger/logger.service';

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
      : res.status(500).json({ message: 'DATABASE CONNECTION IS NOT WORKING' });
  }

  @Get('countries')
  async getCountries(@Res() res: Response): Promise<Response> {
    return res.status(200).json({ countries: await this.countriesService.findAll() });
  }

  @Get('demo')
  async getDemo(): Promise<User[]> {
    return this.userService.find({}, '-password -salt');
  }
}
