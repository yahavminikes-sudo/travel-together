import { startServer } from './server';
import { appConfig } from './config/appConfig';

// Entities & Implementations
import { createMongoDatabase } from './details/database/mongo/MongoDatabase';
import { createJwtAuthService } from './details/auth/jwtAuthService';
import { createUserRepository } from './details/database/mongo/repositories/userRepository';
import { createAuthRepository } from './details/database/mongo/repositories/authRepository';
import { createPostRepository } from './details/database/mongo/repositories/postRepository';
import { createCommentRepository } from './details/database/mongo/repositories/commentRepository';

// Web Server Factory
import { createExpressServer, ExpressDependencies } from './details/server/express/expressServer';

// 1. Manually instantiate internal Dependencies
const mongoDatabase = createMongoDatabase();

const dependencies: ExpressDependencies = {
  authService: createJwtAuthService(),
  authRepository: createAuthRepository(),
  userRepository: createUserRepository(),
  postRepository: createPostRepository(),
  commentRepository: createCommentRepository(),
};

// 2. Pass dependencies into the specific Web Server implementation
const webServer = createExpressServer(dependencies);

// 3. Start the Orchestration layer
startServer(mongoDatabase, webServer, appConfig.PORT);
