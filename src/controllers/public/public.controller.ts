import { LoggerService } from './../../services/logger/logger.service';
import { Controller, Get, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection } from 'mongoose';

import { DemoService } from './../../models/demo/demo.service';
import { CountriesService } from './../../models/countries/countries.service';

@Controller('public')
export class PublicController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly countriesService: CountriesService,
    private readonly demoService: DemoService,
  ) {}

  logger = new LoggerService('Public');

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
  async getDemo(@Res() res: Response): Promise<Response> {
    await this.demoService.removeDemo();
    const added = await this.demoService.addDemo();
    const updated = await this.demoService.updateDemo(added._id);
    this.logger.log('Updated log', updated);
    return res.status(200).json({ demo: await this.demoService.findAll() });
  }
}
