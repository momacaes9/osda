import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { UserAuthentication } from './entities/userAuthentication.entity.js';
import { TokenService } from './token.service.js';
import { AuthenticationController } from './authentication.controller.js';
import { JwtStrategy } from '../../auth/jwt.strategy.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAuthentication]),
  ],
  controllers: [AuthenticationController],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class AuthenticationModule {}
