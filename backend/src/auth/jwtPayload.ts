export interface JwtPayload {
  userId: number;
  sessionId?: number;
}

export interface AuthenticatedUser {
  userId: number;
  sessionId?: number;
}
