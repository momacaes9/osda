import { Body, Controller, Headers, HttpCode, Post, UseGuards } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { UsersService } from '../users/users.service.js';
import { TokenService } from './token.service.js';
import { UserInputModel } from '../users/types/userInputModel.js';
import { UserJwtAuthenticationGuard } from '../../auth/userJwtAuthentication.guard.js';
import { CurrentUser } from '../../auth/currentUser.decorator.js';
import type { AuthenticatedUser } from '../../auth/jwtPayload.js';

class LoginInputModel {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

class RefreshInputModel {
  @IsString()
  refreshToken: string;
}

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  async register(@Body() body: UserInputModel, @Headers('user-agent') browser?: string) {
    const user = await this.usersService.createUser(body);
    const tokens = await this.tokenService.createSession(user.id, browser);
    return { user, ...tokens };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginInputModel, @Headers('user-agent') browser?: string) {
    const entity = await this.usersService.getAndValidateUser(body.email, body.password);
    const user = await this.usersService.getOneById(entity.id);
    const tokens = await this.tokenService.createSession(user.id, browser);
    return { user, ...tokens };
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: RefreshInputModel) {
    return this.tokenService.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(UserJwtAuthenticationGuard)
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.tokenService.revoke(user.sessionId);
  }
}
