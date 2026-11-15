import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserJwtAuthenticationGuard } from '../../auth/userJwtAuthentication.guard.js';
import { CurrentUser } from '../../auth/currentUser.decorator.js';
import type { AuthenticatedUser } from '../../auth/jwtPayload.js';

@Controller('users')
@UseGuards(UserJwtAuthenticationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getOneById(user.userId);
  }

  @Patch('me/language')
  setLanguage(@CurrentUser() user: AuthenticatedUser, @Body() body: { language: string }) {
    return this.usersService.updateLanguage(user.userId, body.language);
  }
}
