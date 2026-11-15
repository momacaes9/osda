import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { EnvironmentVariables } from '../../config/environmentVariables.js';

@Injectable()
export class PasswordService {
  private readonly saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds =
      Number(this.configService.get<number>(EnvironmentVariables.BCRYPT_SALT_ROUNDS)) || 12;
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
