import fs from 'fs';
import path from 'path';
import { appConfig } from './config/appConfig';
import { createGoogleAuthVerifier } from './details/auth/googleAuthVerifier';
import { createJwtAuthProvider } from './details/auth/jwtAuthProvider';
import { createMongoDatabase } from './details/database/mongo/MongoDatabase';
import { createAuthRepository } from './details/database/mongo/repositories/authRepository';
import { createCommentRepository } from './details/database/mongo/repositories/commentRepository';
import { createEmbeddingRepository } from './details/database/mongo/repositories/embeddingRepository';
import { createPostRepository } from './details/database/mongo/repositories/postRepository';
import { createUserRepository } from './details/database/mongo/repositories/userRepository';
import { createSwaggerDocsProvider } from './details/docs/swaggerDocsProvider';
import { createGeminiEmbeddingProvider } from './details/embedding/geminiEmbeddingProvider';
import { createExpressServer, ExpressDependencies } from './details/server/express/expressServer';
import { startServer } from './server';
import { createAuthService } from './services/authService';
import { createCommentService } from './services/commentService';
import { createEmbeddingService } from './services/embeddingService';
import { createPostService } from './services/postService';
import { createUserService } from './services/userService';

const mongoDatabase = createMongoDatabase();

const authProvider = createJwtAuthProvider();
const googleAuthVerifier = createGoogleAuthVerifier();
const embeddingProvider = createGeminiEmbeddingProvider();

const authRepository = createAuthRepository();
const userRepository = createUserRepository();
const commentRepository = createCommentRepository(userRepository);
const postRepository = createPostRepository(userRepository, commentRepository);
const embeddingRepository = createEmbeddingRepository();

const authService = createAuthService({ authRepository, authProvider, googleAuthVerifier });
const userService = createUserService({ userRepository });
const embeddingService = createEmbeddingService({ embeddingRepository, embeddingProvider });
const postService = createPostService({ postRepository, embeddingService });
const commentService = createCommentService({ commentRepository, embeddingService });

const docsProvider = createSwaggerDocsProvider();

let sslOptions: { key: Buffer; cert: Buffer } | undefined;
if (appConfig.NODE_ENV === 'production') {
  try {
    const keyPath = path.resolve(appConfig.SSL_KEY_PATH);
    const certPath = path.resolve(appConfig.SSL_CERT_PATH);

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    } else {
      console.warn('SSL certificates not found, falling back to HTTP even in production.');
    }
  } catch (err) {
    console.error('Failed to load SSL certificates:', err);
  }
}

const dependencies: ExpressDependencies = {
  authService,
  authenticator: (token: string) => {
    const payload = authProvider.verifyToken(token);
    return payload && payload._id ? payload._id : null;
  },
  postService,
  commentService,
  userService,
  embeddingService,
  docsProvider,
  sslOptions
};

const webServer = createExpressServer(dependencies);

startServer(mongoDatabase, webServer, appConfig.PORT);
