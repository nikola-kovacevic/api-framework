import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Response } from 'express';

import { User } from '../../decorators/user.decorator';
import { Roles } from './../../decorators/roles.decorator';
import { Token } from './../../decorators/token.decorator';

import { RolesGuard } from './../../guards/roles.guard';

import { UserDto } from './../../models/users/user.interface';
import { UserService } from './../../models/users/user.service';

import { AuthService } from './../../services/auth/auth.service';
import { LoggerService } from './../../services/logger/logger.service';

import { ResourceId } from './../../validators/shared/resource-id.validator';
import { CreateUser, UpdateUser } from './../../validators/user-management/';

@Controller('user-management')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserManagementController {
  logger = new LoggerService('UserManagement');

  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get('user/:id')
  async getUser(@Param() params: ResourceId, @User() user: UserDto, @Res() res: Response): Promise<Response> {
    if (user.role !== 'ADMIN' && user._id !== params.id) {
      throw new ForbiddenException();
    }
    return res.status(202).json({ message: 'User found', user: await this.userService.findOne({ _id: params.id }) });
  }

  @Patch('user/:id')
  async updateUser(
    @Param() params: ResourceId,
    @Token() token,
    @User() user,
    @Body() newUserData: UpdateUser,
    @Res() res: Response,
  ): Promise<Response> {
    if (user.role !== 'ADMIN' && user._id !== params.id) {
      throw new ForbiddenException();
    }

    if (user.role !== 'ADMIN') {
      delete newUserData.status;
      delete newUserData.role;
    }

    return this.userService
      .updateOne({ _id: params.id }, newUserData)
      .then(async updatedUser => {
        if (user.role !== 'ADMIN' && newUserData.email !== user.email) {
          // TODO: generate authentication email
          await this.authService.blacklistToken(token, user.exp);
        }

        return res.status(202).json({ message: 'User updated', user: updatedUser });
      })
      .catch(error => {
        res.locals.debug = { error };
        if (error.name === 'MongoError' && error.code === 11000) {
          throw new ConflictException('User with this email already exists');
        }
        throw new UnprocessableEntityException('Update user action failed');
      });
  }

  @Post('user/logout')
  async logout(@User() user, @Token() oldToken, @Res() res: Response): Promise<Response> {
    await this.authService.blacklistToken(oldToken, user.exp);
    return res.status(202).json({ message: 'User logged out' });
  }

  @Delete('user/:id')
  @Roles('ADMIN')
  async deleteUser(@Param() params: ResourceId, @Res() res: Response): Promise<Response> {
    const user = await this.userService.delete({ _id: params.id });
    if (user.deletedCount !== 1) {
      throw new NotFoundException('User not found');
    }

    return res.status(202).json({ message: 'User deleted', user: await this.userService.delete({ _id: params.id }) });
  }

  @Get('users')
  @Roles('ADMIN')
  async getUsers(@Res() res: Response): Promise<Response> {
    // TODO: implement pagination
    return res.status(200).json({ message: 'List of users', users: await this.userService.find({}) });
  }

  @Post('user')
  @Roles('ADMIN')
  async createUser(@Body() userData: CreateUser, @Res() res: Response): Promise<Response> {
    return this.userService
      .createOne(userData)
      .then(user => res.status(202).json({ message: 'User created', user }))
      .catch(error => {
        res.locals.debug = { error };
        if (error.name === 'MongoError' && error.code === 11000) {
          throw new ConflictException('User with this email already exists');
        }
        throw new UnprocessableEntityException('Create user action failed');
      });
  }
}
