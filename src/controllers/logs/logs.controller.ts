import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Response } from 'express';

import { Pagination } from './../../decorators/pagination.decorator';
import { Roles } from './../../decorators/roles.decorator';
import { Search } from './../../decorators/search.decorator';

import { RolesGuard } from './../../guards/roles.guard';

import { ApplicationLogService } from './../../models/logs/application_logs/application_log.service';
import { EventLogService } from './../../models/logs/event_logs/event_log.service';

@Controller('logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LogsController {
  constructor(
    private readonly applicationLogService: ApplicationLogService,
    private readonly eventLogService: EventLogService,
  ) {}

  @Get('event')
  @Roles('ADMIN')
  async getEventLogs(
    @Pagination() pagination,
    @Search() find,
    @Query() query,
    @Res() res: Response,
  ): Promise<Response> {
    // TODO: add order by
    const filter = query.status ? [{ 'response.status': query.status }] : [{}];
    const search = find
      ? [{ correlation: { $regex: find } }, { 'request.url': { $regex: find } }, { 'client.email': { $regex: find } }]
      : [{}];

    const [logs, total] = await Promise.all([
      this.eventLogService.find({}, search, filter, pagination),
      this.eventLogService.count({}, search, filter),
    ]);

    return res.status(200).json({ message: 'List of event logs', logs, total });
  }

  @Get('application')
  @Roles('ADMIN')
  async getApplicationLogs(
    @Pagination() pagination,
    @Search() find,
    @Query() query,
    @Res() res: Response,
  ): Promise<Response> {
    // TODO: add order by
    const filter = query.level && typeof query.level === 'string' ? [{ level: query.level.toLowerCase() }] : [{}];
    const search = find ? [{ message: { $regex: find } }, { hostname: { $regex: find } }] : [{}];

    const [logs, total] = await Promise.all([
      this.applicationLogService.find({}, search, filter, pagination),
      this.applicationLogService.count({}, search, filter),
    ]);

    return res.status(200).json({ message: 'List of application logs', logs, total });
  }
}
