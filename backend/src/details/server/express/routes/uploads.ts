import { Router, RequestHandler } from 'express';
import { createUploadController } from '../controllers/uploadController';

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload management
 */

export const createUploadRouter = (
  uploadController: ReturnType<typeof createUploadController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  /**
   * @swagger
   * /api/uploads/image:
   *   post:
   *     summary: Upload an image
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Image uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  router.post('/image', authenticate, uploadController.uploadImage);

  return router;
};
