import { appConfig } from './config/appConfig';
import { createJwtAuthService } from './details/auth/jwtAuthService';
import { createMongoDatabase } from './details/database/mongo/MongoDatabase';
import { createAuthRepository } from './details/database/mongo/repositories/authRepository';
import { createCommentRepository } from './details/database/mongo/repositories/commentRepository';
import { createPostRepository } from './details/database/mongo/repositories/postRepository';
import { createUserRepository } from './details/database/mongo/repositories/userRepository';
import { createExpressServer, ExpressDependencies } from './details/server/express/expressServer';
import { startServer } from './server';

const mongoDatabase = createMongoDatabase();

const dependencies: ExpressDependencies = {
  authService: createJwtAuthService(),
  authRepository: createAuthRepository(),
  userRepository: createUserRepository(),
  postRepository: createPostRepository(),
  commentRepository: createCommentRepository(),
};

const webServer = createExpressServer(dependencies);

startServer(mongoDatabase, webServer, appConfig.PORT);
