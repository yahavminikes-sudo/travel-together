import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { IAuthService, ICommentService, IPostService, IUserService } from '../../../entities/IServices';
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
  authenticator: (token: string) => string | null;
  postService: IPostService;
  commentService: ICommentService;
  userService: IUserService;
}

export const createExpressServer = ({
  authService,
  authenticator,
  postService,
  commentService,
  userService
}: ExpressDependencies): IWebServer => {
  const app: Application = express();
  let serverInstance: Server | null = null;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const authenticate = createAuthenticateMiddleware(authenticator);
  
  const authController = createAuthController({ authService });
  const postController = createPostController({ postService });
  const commentController = createCommentController({ commentService });
  const userController = createUserController({ userService });

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
