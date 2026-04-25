import { Router, RequestHandler } from 'express';
import { commentSchema } from '@travel-together/shared/schemas/commentSchemas';
import { createCommentController } from '../controllers/commentController';
import { validateRequestBody } from '../middlewares/validateRequestBody';

export const createCommentRouter = (
  commentController: ReturnType<typeof createCommentController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/post/:postId', commentController.getCommentsByPost);
  router.get('/:id', commentController.getCommentById);
  router.post('/post/:postId', authenticate, validateRequestBody(commentSchema), commentController.createComment);
  router.put('/:id', authenticate, validateRequestBody(commentSchema), commentController.updateComment);
  router.delete('/:id', authenticate, commentController.deleteComment);

  return router;
};
