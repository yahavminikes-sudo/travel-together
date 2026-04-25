import { Router } from 'express';
import { googleAuthSchema, loginSchema, registerRequestSchema } from '@travel-together/shared/schemas/authSchemas';
import { createAuthController } from '../controllers/authController';
import { validateRequestBody } from '../middlewares/validateRequestBody';

export const createAuthRouter = (authController: ReturnType<typeof createAuthController>) => {
  const router = Router();

  router.post('/register', validateRequestBody(registerRequestSchema), authController.register);
  router.post('/login', validateRequestBody(loginSchema), authController.login);
  router.post('/google', validateRequestBody(googleAuthSchema), authController.googleLogin);

  return router;
};
