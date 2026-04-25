import { IAuthService } from '../entities/IServices';
import { IAuthRepository } from '../entities/IRepositories';
import { IAuthProvider } from '../entities/IAuthProvider';
import { IGoogleAuthVerifier, VerifiedGoogleCredentialPayload } from '../entities/IGoogleAuthVerifier';
import { AuthResponse, LoginCredentials, RegisterCredentials, GoogleAuthRequest } from '@travel-together/shared/types/auth.types';

const USERNAME_FALLBACK = 'traveler';
const USERNAME_SEPARATOR = '-';

const sanitizeUsernameBase = (value: string): string => {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, USERNAME_SEPARATOR)
    .replace(/^-+|-+$/g, '');

  return sanitized || USERNAME_FALLBACK;
};

export const createAuthService = ({
  authRepository,
  authProvider,
  googleAuthVerifier
}: {
  authRepository: IAuthRepository;
  authProvider: IAuthProvider;
  googleAuthVerifier: IGoogleAuthVerifier;
}): IAuthService => {
  const createAuthResponse = async (
    record: Awaited<ReturnType<IAuthRepository['saveAuthRecord']>>
  ): Promise<AuthResponse> => {
    const tokens = authProvider.generateTokens({ _id: record._id, email: record.email });
    record.refreshTokens = record.refreshTokens ? [...record.refreshTokens, tokens.refreshToken] : [tokens.refreshToken];
    const savedRecord = await authRepository.saveAuthRecord(record);
    const { password: _, refreshTokens: __, googleId: ___, ...publicUser } = savedRecord;
    return { user: publicUser, token: tokens.accessToken, refreshToken: tokens.refreshToken };
  };

  const buildUniqueUsername = async (payload: VerifiedGoogleCredentialPayload): Promise<string> => {
    const baseUsername = sanitizeUsernameBase(payload.name || payload.email.split('@')[0] || USERNAME_FALLBACK);
    let candidate = baseUsername;
    let suffix = 1;

    while (await authRepository.findAuthRecordByUsername(candidate)) {
      candidate = `${baseUsername}${USERNAME_SEPARATOR}${suffix}`;
      suffix += 1;
    }

    return candidate;
  };

  return {
    register: async (dto: RegisterCredentials): Promise<AuthResponse> => {
      const existing = await authRepository.findAuthRecordByEmail(dto.email);
      if (existing) {
        throw new Error('Email already registered');
      }

      if (!dto.password) throw new Error('Password is required');

      const hashedPassword = await authProvider.hashPassword(dto.password);
      const newRecord = await authRepository.saveAuthRecord({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return createAuthResponse(newRecord);
    },

    login: async (dto: LoginCredentials): Promise<AuthResponse> => {
      if (!dto.password) throw new Error('Password is required');

      const record = await authRepository.findAuthRecordByEmail(dto.email);
      if (!record || !record.password) {
        throw new Error('Invalid credentials');
      }

      const isValid = await authProvider.comparePassword(dto.password, record.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      return createAuthResponse(record);
    },

    googleLogin: async (dto: GoogleAuthRequest): Promise<AuthResponse> => {
      const verifiedPayload = await googleAuthVerifier.verifyCredential(dto.credential);

      if (!verifiedPayload.emailVerified) {
        throw new Error('Invalid Google credential');
      }

      const existingGoogleAccount = await authRepository.findAuthRecordByGoogleId(verifiedPayload.googleId);
      if (existingGoogleAccount) {
        return createAuthResponse(existingGoogleAccount);
      }

      const existingEmailAccount = await authRepository.findAuthRecordByEmail(verifiedPayload.email);
      if (existingEmailAccount) {
        if (existingEmailAccount.googleId && existingEmailAccount.googleId !== verifiedPayload.googleId) {
          throw new Error('Google account conflict');
        }

        existingEmailAccount.googleId = verifiedPayload.googleId;
        if (!existingEmailAccount.avatarUrl && verifiedPayload.picture) {
          existingEmailAccount.avatarUrl = verifiedPayload.picture;
        }

        const linkedAccount = await authRepository.saveAuthRecord(existingEmailAccount);
        return createAuthResponse(linkedAccount);
      }

      const username = await buildUniqueUsername(verifiedPayload);
      const createdAccount = await authRepository.saveAuthRecord({
        username,
        email: verifiedPayload.email,
        googleId: verifiedPayload.googleId,
        password: undefined,
        avatarUrl: verifiedPayload.picture || '',
        bio: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return createAuthResponse(createdAccount);
    }
  };
};
