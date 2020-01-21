import { Controller, Get, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection } from 'mongoose';

@Controller('public')
export class PublicController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('health')
  checkHealth(@Res() res: Response): Response {
    return this.connection.readyState === 1
      ? res.status(200).json({ message: 'APPLICATION AND DATABASE ARE WORKING' })
      : res.status(500).json({ message: 'DATABASE CONNECTION IS NOT WORKING' });
  }
}
