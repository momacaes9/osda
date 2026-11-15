import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { AuthStrategies } from '../constants/authStrategies.js';
import { EnvironmentVariables } from '../config/environmentVariables.js';
import { UserAuthentication } from '../modules/authentication/entities/userAuthentication.entity.js';
import type { AuthenticatedUser, JwtPayload } from './jwtPayload.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT) {
  constructor(
    configService: ConfigService,
    @InjectRepository(UserAuthentication)
    private readonly sessions: Repository<UserAuthentication>,
  ) {
    const secret = configService.get<string>(EnvironmentVariables.JWT_SECRET);
    if (!secret) throw new Error('JWT_SECRET is not set');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (payload.sessionId) {
      const session = await this.sessions.findOne({ where: { id: payload.sessionId } });
      if (!session) throw new UnauthorizedException('Session expired');
    }
    return { userId: payload.userId, sessionId: payload.sessionId };
  }
}
