import { User } from '@travel-together/shared/types/user.types';

export interface AuthRecord extends User {
  password?: string;
  refreshTokens?: string[];
}
