import { Router, RequestHandler } from 'express';
import { createCommentController } from '../controllers/commentController';

export const createCommentRouter = (
  commentController: ReturnType<typeof createCommentController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/post/:postId', commentController.getCommentsByPost);
  router.get('/:id', commentController.getCommentById);

  router.post('/post/:postId', authenticate, commentController.createComment);
  router.put('/:id', authenticate, commentController.updateComment);
  router.delete('/:id', authenticate, commentController.deleteComment);

  return router;
};
