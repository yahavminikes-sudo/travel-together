import { Router } from 'express';
import { createAuthController } from '../controllers/authController';

export const createAuthRouter = (authController: ReturnType<typeof createAuthController>) => {
  const router = Router();
  
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  
  return router;
};
