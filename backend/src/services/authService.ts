import { IAuthService } from '../entities/IServices';
import { IAuthRepository } from '../entities/IRepositories';
import { IAuthProvider } from '../entities/IAuthProvider';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@shared/auth.types';

export const createAuthService = (deps: { authRepository: IAuthRepository, authProvider: IAuthProvider }): IAuthService => {
  return {
    register: async (dto: RegisterCredentials): Promise<AuthResponse> => {
      const existing = await deps.authRepository.findAuthRecordByEmail(dto.email);
      if (existing) {
        throw new Error('Email already registered');
      }
      
      if (!dto.password) throw new Error('Password is required');
      
      const hashedPassword = await deps.authProvider.hashPassword(dto.password);
      const newRecord = await deps.authRepository.saveAuthRecord({
        _id: '',
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const tokens = deps.authProvider.generateTokens({ _id: newRecord._id, email: newRecord.email });
      newRecord.refreshTokens = [tokens.refreshToken];
      await deps.authRepository.saveAuthRecord(newRecord);
      
      const { password: _, refreshTokens: __, ...publicUser } = newRecord;
      return { user: publicUser, token: tokens.accessToken, refreshToken: tokens.refreshToken };
    },
    
    login: async (dto: LoginCredentials): Promise<AuthResponse> => {
      if (!dto.password) throw new Error('Password is required');
      
      const record = await deps.authRepository.findAuthRecordByEmail(dto.email);
      if (!record || !record.password) {
        throw new Error('Invalid credentials');
      }
      
      const isValid = await deps.authProvider.comparePassword(dto.password, record.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      
      const tokens = deps.authProvider.generateTokens({ _id: record._id, email: record.email });
      record.refreshTokens = record.refreshTokens ? [...record.refreshTokens, tokens.refreshToken] : [tokens.refreshToken];
      await deps.authRepository.saveAuthRecord(record);
      
      const { password: _, refreshTokens: __, ...publicUser } = record;
      return { user: publicUser, token: tokens.accessToken, refreshToken: tokens.refreshToken };
    }
  };
};
