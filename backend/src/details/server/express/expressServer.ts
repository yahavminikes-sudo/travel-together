import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { IDocsProvider } from '../../../entities/IDocsProvider';
import {
  IAuthService,
  ICommentService,
  IEmbeddingService,
  IPostService,
  IUserService
} from '../../../entities/IServices';
import { IWebServer } from '../../../entities/IWebServer';
import { createAuthController } from './controllers/authController';
import { createCommentController } from './controllers/commentController';
import { createPostController } from './controllers/postController';
import { createSearchController } from './controllers/searchController';
import { createUploadController } from './controllers/uploadController';
import { createUserController } from './controllers/userController';
import { createAuthenticateMiddleware } from './middlewares/authenticate';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { createAuthRouter } from './routes/auth';
import { createCommentRouter } from './routes/comments';
import { createPostRouter } from './routes/posts';
import { createSearchRouter } from './routes/search';
import { createUploadRouter } from './routes/uploads';
import { createUserRouter } from './routes/users';

export interface ExpressDependencies {
  authService: IAuthService;
  authenticator: (token: string) => string | null;
  postService: IPostService;
  commentService: ICommentService;
  userService: IUserService;
  embeddingService: IEmbeddingService;
  docsProvider?: IDocsProvider;
}

export const createExpressServer = ({
  authService,
  authenticator,
  postService,
  commentService,
  userService,
  embeddingService,
  docsProvider
}: ExpressDependencies): IWebServer => {
  const app: Application = express();
  let serverInstance: Server | null = null;
  const uploadsDir = path.resolve(process.cwd(), 'uploads');

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.use('/uploads', express.static(uploadsDir));

  const authenticate = createAuthenticateMiddleware(authenticator);

  const authController = createAuthController({ authService });
  const postController = createPostController({ postService });
  const commentController = createCommentController({ commentService });
  const userController = createUserController({ userService });
  const searchController = createSearchController({ embeddingService });
  const uploadController = createUploadController();

  app.get('/health', (req, res) => {
    res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (docsProvider) {
    docsProvider.getRoutes().forEach((route) => {
      app.use(route.path, ...route.handlers);
    });
  }

  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/posts', createPostRouter(postController, authenticate));
  app.use('/api/comments', createCommentRouter(commentController, authenticate));
  app.use('/api/users', createUserRouter(userController, authenticate));
  app.use('/api/search', createSearchRouter(searchController));
  app.use('/api/uploads', createUploadRouter(uploadController, authenticate));

  app.use(errorHandler);

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
    },
    getApp: () => app
  };
};
