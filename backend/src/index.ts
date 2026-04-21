import { appConfig } from './config/appConfig';
import { createJwtAuthProvider } from './details/auth/jwtAuthProvider';
import { createMongoDatabase } from './details/database/mongo/MongoDatabase';
import { createAuthRepository } from './details/database/mongo/repositories/authRepository';
import { createCommentRepository } from './details/database/mongo/repositories/commentRepository';
import { createPostRepository } from './details/database/mongo/repositories/postRepository';
import { createUserRepository } from './details/database/mongo/repositories/userRepository';
import { createExpressServer, ExpressDependencies } from './details/server/express/expressServer';
import { startServer } from './server';
import { createAuthService } from './services/authService';
import { createCommentService } from './services/commentService';
import { createPostService } from './services/postService';
import { createUserService } from './services/userService';

const mongoDatabase = createMongoDatabase();

const authProvider = createJwtAuthProvider();
const authRepository = createAuthRepository();
const userRepository = createUserRepository();
const postRepository = createPostRepository();
const commentRepository = createCommentRepository();

const authService = createAuthService({ authRepository, authProvider });
const postService = createPostService({ postRepository });
const commentService = createCommentService({ commentRepository });
const userService = createUserService({ userRepository });

const dependencies: ExpressDependencies = {
  authService,
  authenticator: (token: string) => {
    const payload = authProvider.verifyToken(token);
    return payload && payload._id ? payload._id : null;
  },
  postService,
  commentService,
  userService
};

const webServer = createExpressServer(dependencies);

startServer(mongoDatabase, webServer, appConfig.PORT);
