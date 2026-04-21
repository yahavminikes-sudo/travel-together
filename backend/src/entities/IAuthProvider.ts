import type { JwtPayload } from 'jsonwebtoken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenPayload extends JwtPayload {
  _id: string;
  email: string;
}

export interface IAuthProvider {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateTokens(payload: AuthTokenPayload): TokenPair;
  verifyToken(token: string, isRefresh?: boolean): AuthTokenPayload | null;
}
