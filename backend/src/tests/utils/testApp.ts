import { GoogleAuthRequest } from '@travel-together/shared/types/auth.types';
import { createJwtAuthProvider } from '../../details/auth/jwtAuthProvider';
import { createAuthRepository } from '../../details/database/mongo/repositories/authRepository';
import { createCommentRepository } from '../../details/database/mongo/repositories/commentRepository';
import { createEmbeddingRepository } from '../../details/database/mongo/repositories/embeddingRepository';
import { createPostRepository } from '../../details/database/mongo/repositories/postRepository';
import { createUserRepository } from '../../details/database/mongo/repositories/userRepository';
import { createExpressServer, ExpressDependencies } from '../../details/server/express/expressServer';
import { IEmbeddingProvider } from '../../entities/IEmbeddingProvider';
import { IGoogleAuthVerifier, VerifiedGoogleCredentialPayload } from '../../entities/IGoogleAuthVerifier';
import { createAuthService } from '../../services/authService';
import { createCommentService } from '../../services/commentService';
import { createEmbeddingService } from '../../services/embeddingService';
import { createPostService } from '../../services/postService';
import { createUserService } from '../../services/userService';

const createMockEmbeddingProvider = (): IEmbeddingProvider => {
  return {
    generateEmbedding: async (text: string): Promise<number[]> => {
      const normalizedText = text.toLowerCase().trim();
      const vector = new Array(768).fill(0);
      for (let i = 0; i < normalizedText.length; i++) {
        const code = normalizedText.charCodeAt(i);
        if (code < 768) {
          vector[code]++;
        }
      }
      
      return vector;
    }
  };
};

type MockGooglePayload = VerifiedGoogleCredentialPayload;

const mockGoogleCredentials = new Map<string, MockGooglePayload>();

export const setMockGoogleCredential = (credential: string, payload: MockGooglePayload): void => {
  mockGoogleCredentials.set(credential, payload);
};

export const clearMockGoogleCredentials = (): void => {
  mockGoogleCredentials.clear();
};

const createMockGoogleAuthVerifier = (): IGoogleAuthVerifier => ({
  verifyCredential: async (credential: GoogleAuthRequest['credential']): Promise<VerifiedGoogleCredentialPayload> => {
    const payload = mockGoogleCredentials.get(credential);
    if (!payload) {
      throw new Error('Invalid Google credential');
    }

    return payload;
  }
});

export const getTestApp = () => {
  const authProvider = createJwtAuthProvider();
  const googleAuthVerifier = createMockGoogleAuthVerifier();
  const embeddingProvider = createMockEmbeddingProvider();

  const authRepository = createAuthRepository();
  const userRepository = createUserRepository();
  const commentRepository = createCommentRepository(userRepository);
  const postRepository = createPostRepository(userRepository, commentRepository);
  const embeddingRepository = createEmbeddingRepository();

  const authService = createAuthService({ authRepository, authProvider, googleAuthVerifier });
  const userService = createUserService({ userRepository });
  const embeddingService = createEmbeddingService({
    embeddingRepository,
    embeddingProvider
  });
  const postService = createPostService({ postRepository, embeddingService });
  const commentService = createCommentService({ commentRepository, embeddingService });

  const dependencies: ExpressDependencies = {
    authService,
    authenticator: (token: string) => {
      const payload = authProvider.verifyToken(token);
      return payload && payload._id ? payload._id : null;
    },
    postService,
    commentService,
    userService,
    embeddingService
  };

  const webServer = createExpressServer(dependencies);
  return webServer.getApp();
};
