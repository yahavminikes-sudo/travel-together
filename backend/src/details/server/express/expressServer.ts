import express, { Application } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { IWebServer } from '../../../entities/IWebServer';
import { IAuthService } from '../../../entities/IAuthService';
import { IUserRepository, IPostRepository, ICommentRepository, IAuthRepository } from '../../../entities/IRepositories';

// This interface will grow as we introduce Controllers/Routers and other dependencies
export interface ExpressDependencies {
  authService: IAuthService;
  authRepository: IAuthRepository;
  userRepository: IUserRepository;
  postRepository: IPostRepository;
  commentRepository: ICommentRepository;
  // Routers will be injected here in later tasks
}

export const createExpressServer = (deps: ExpressDependencies): IWebServer => {
  const app: Application = express();
  let serverInstance: Server | null = null;

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Base routes
  app.get('/health', (req, res) => {
    res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Future wiring of dependencies into routes:
  // if (deps.authRouter) app.use('/api/auth', deps.authRouter);

  // Return exactly the interface contract without leaking the 'app' module
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
