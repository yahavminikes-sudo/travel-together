import { User } from '@travel-together/shared/types/user.types';

export interface AuthRecord extends User {
  googleId?: string;
  password?: string;
  refreshTokens?: string[];
}
