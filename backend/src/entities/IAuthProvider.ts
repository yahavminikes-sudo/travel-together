export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthProvider {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateTokens(payload: object): TokenPair;
  verifyToken(token: string, isRefresh?: boolean): any | null;
}
