import { createJwtAuthProvider } from '../../details/auth/jwtAuthProvider';
import { createAuthRepository } from '../../details/database/mongo/repositories/authRepository';
import { createCommentRepository } from '../../details/database/mongo/repositories/commentRepository';
import { createEmbeddingRepository } from '../../details/database/mongo/repositories/embeddingRepository';
import { createPostRepository } from '../../details/database/mongo/repositories/postRepository';
import { createUserRepository } from '../../details/database/mongo/repositories/userRepository';
import { createExpressServer, ExpressDependencies } from '../../details/server/express/expressServer';
import { IEmbeddingProvider } from '../../entities/IEmbeddingProvider';
import { createAuthService } from '../../services/authService';
import { createCommentService } from '../../services/commentService';
import { createEmbeddingService } from '../../services/embeddingService';
import { createPostService } from '../../services/postService';
import { createUserService } from '../../services/userService';

const createMockEmbeddingProvider = (): IEmbeddingProvider => ({
  generateEmbedding: async (text: string): Promise<number[]> => {
    const vector = new Array(768).fill(0);
    for (let i = 0; i < text.length && i < 768; i++) {
      vector[i] = text.charCodeAt(i) / 255;
    }
    return vector;
  }
});

export const getTestApp = () => {
  const authProvider = createJwtAuthProvider();
  const embeddingProvider = createMockEmbeddingProvider();

  const authRepository = createAuthRepository();
  const userRepository = createUserRepository();
  const postRepository = createPostRepository();
  const commentRepository = createCommentRepository();
  const embeddingRepository = createEmbeddingRepository();

  const authService = createAuthService({ authRepository, authProvider });
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
