import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthStrategies } from '../constants/authStrategies.js';

@Injectable()
export class UserJwtAuthenticationGuard extends AuthGuard(AuthStrategies.JWT) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}

/**
 * Same as UserJwtAuthenticationGuard, but lets anonymous requests through.
 * If a valid token is sent, req.user is populated.
 */
@Injectable()
export class OptionalJwtAuthenticationGuard extends AuthGuard(AuthStrategies.JWT) {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return (user || undefined) as TUser;
  }
}
