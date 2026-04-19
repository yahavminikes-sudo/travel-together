import { User } from '@shared/user.types';

export interface AuthRecord extends User {
  password?: string;
  refreshTokens?: string[];
}
