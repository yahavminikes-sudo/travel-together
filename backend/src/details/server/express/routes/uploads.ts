import { Router, RequestHandler } from 'express';
import { createUploadController } from '../controllers/uploadController';

export const createUploadRouter = (
  uploadController: ReturnType<typeof createUploadController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.post('/image', authenticate, uploadController.uploadImage);

  return router;
};
