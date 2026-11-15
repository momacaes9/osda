import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvironmentVariables } from '../../config/environmentVariables.js';
import { UsersService } from '../users/users.service.js';
import { UserAuthentication } from './entities/userAuthentication.entity.js';
import type { JwtPayload } from '../../auth/jwtPayload.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class TokenService {
  private readonly JWT_ACCESS_EXPIRATION_FALLBACK = '3600';
  private readonly JWT_REFRESH_EXPIRATION_FALLBACK = '86400';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(UserAuthentication)
    private readonly sessions: Repository<UserAuthentication>,
  ) {}

  private getSecret(): string {
    const secret = this.configService.get<string>(EnvironmentVariables.JWT_SECRET);
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is not set');
    }
    return secret;
  }

  private async sign(payload: JwtPayload, envKey: EnvironmentVariables, fallback: string) {
    const expiresIn = parseInt(this.configService.get<string>(envKey) || fallback, 10);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.getSecret(),
      expiresIn,
    });
    return { token, expiresIn };
  }

  async generateAccessToken(userId: number, sessionId?: number): Promise<string> {
    const user = await this.userService.getOneById(userId);
    const payload: JwtPayload = { userId: user.id, sessionId };
    const { token } = await this.sign(
      payload,
      EnvironmentVariables.JWT_ACCESS_EXPIRATION,
      this.JWT_ACCESS_EXPIRATION_FALLBACK,
    );
    return token;
  }

  /** Creates a new session row and returns an access + refresh token pair. */
  async createSession(userId: number, browser?: string): Promise<TokenPair> {
    const session = await this.sessions.save(
      this.sessions.create({ userId, browser: browser?.slice(0, 512) ?? null }),
    );
    return this.issueTokens(session);
  }

  private async issueTokens(session: UserAuthentication): Promise<TokenPair> {
    const accessToken = await this.generateAccessToken(session.userId, session.id);
    const expiresIn = parseInt(
      this.configService.get<string>(EnvironmentVariables.JWT_ACCESS_EXPIRATION) ||
        this.JWT_ACCESS_EXPIRATION_FALLBACK,
      10,
    );
    const refresh = await this.sign(
      { userId: session.userId, sessionId: session.id },
      EnvironmentVariables.JWT_REFRESH_EXPIRATION,
      this.JWT_REFRESH_EXPIRATION_FALLBACK,
    );
    session.authToken = accessToken;
    session.refreshToken = refresh.token;
    await this.sessions.save(session);
    return { accessToken, refreshToken: refresh.token, expiresIn };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.getSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const session = await this.sessions.findOne({ where: { id: payload.sessionId } });
    if (!session || session.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.issueTokens(session);
  }

  async revoke(sessionId?: number): Promise<void> {
    if (sessionId) await this.sessions.delete({ id: sessionId });
  }
}
