import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PasswordService } from '../authentication/password.service.js';
import { UserAuthentication } from '../authentication/entities/userAuthentication.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuthentication])],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
