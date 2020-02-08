import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Response } from 'express';

import { Roles } from './../../decorators/roles.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { CacheService } from './../../services/cache/cache.service';
import { ManageCache } from './../../validators/admin';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  @Post('cache')
  @Roles('ADMIN')
  async manageCache(@Body() body: ManageCache, @Res() res: Response): Promise<Response> {
    CacheService.manageCache(body.enabled);
    return res.status(202).json({ message: `Cache was ${body.enabled ? 'enabled' : 'disabled'}` });
  }

  @Post('cache/clear')
  @Roles('ADMIN')
  async clearCache(@Res() res: Response): Promise<Response> {
    await CacheService.clearCache();
    return res.status(202).json({ message: 'Cache cleared' });
  }
}
