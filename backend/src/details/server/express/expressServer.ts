import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../../../entities/IAuthService';
import { IAuthRepository, ICommentRepository, IPostRepository, IUserRepository } from '../../../entities/IRepositories';
import { IWebServer } from '../../../entities/IWebServer';
import { createAuthController } from './controllers/authController';
import { createCommentController } from './controllers/commentController';
import { createPostController } from './controllers/postController';
import { createUserController } from './controllers/userController';
import { createAuthenticateMiddleware } from './middlewares/authenticate';
import { createAuthRouter } from './routes/auth';
import { createCommentRouter } from './routes/comments';
import { createPostRouter } from './routes/posts';
import { createUserRouter } from './routes/users';

export interface ExpressDependencies {
  authService: IAuthService;
  authRepository: IAuthRepository;
  userRepository: IUserRepository;
  postRepository: IPostRepository;
  commentRepository: ICommentRepository;
  authenticator: (token: string) => string | null;
}

export const createExpressServer = (deps: ExpressDependencies): IWebServer => {
  const app: Application = express();
  let serverInstance: Server | null = null;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const authenticate = createAuthenticateMiddleware(deps.authenticator);
  
  const authController = createAuthController({ authService: deps.authService, authRepository: deps.authRepository });
  const postController = createPostController({ postRepository: deps.postRepository });
  const commentController = createCommentController({ commentRepository: deps.commentRepository });
  const userController = createUserController({ userRepository: deps.userRepository });

  app.get('/health', (req, res) => {
    res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/posts', createPostRouter(postController, authenticate));
  app.use('/api/comments', createCommentRouter(commentController, authenticate));
  app.use('/api/users', createUserRouter(userController, authenticate));

  return {
    start: async (port: number | string): Promise<void> => {
      return new Promise((resolve) => {
        serverInstance = app.listen(port, () => {
          console.log(`Express server is running on port ${port}`);
          resolve();
        });
      });
    },
    stop: async (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (serverInstance) {
          serverInstance.close((err) => {
            if (err) return reject(err);
            console.log('Express server stopped.');
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
  };
};
