import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload, IAuthProvider, TokenPair } from '../../entities/IAuthProvider';
import { appConfig } from '../../config/appConfig';

const SALT_ROUNDS = 10;

export const createJwtAuthProvider = (): IAuthProvider => ({
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  generateTokens: (payload: AuthTokenPayload): TokenPair => {
    const accessToken = jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, appConfig.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  },

  verifyToken: (token: string, isRefresh?: boolean): AuthTokenPayload | null => {
    try {
      const secret = isRefresh ? appConfig.JWT_REFRESH_SECRET : appConfig.JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === 'string' || !decoded._id || !decoded.email) {
        return null;
      }

      return decoded as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  }
});
