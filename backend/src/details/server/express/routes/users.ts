import { Router, RequestHandler } from 'express';
import { createUserController } from '../controllers/userController';

export const createUserRouter = (
  userController: ReturnType<typeof createUserController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/profile', authenticate, userController.getProfile);
  router.put('/profile', authenticate, userController.updateProfile);
  router.get('/:id', userController.getUserById);

  return router;
};
