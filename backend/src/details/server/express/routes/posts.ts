import { Router, RequestHandler } from 'express';
import { createPostController } from '../controllers/postController';

export const createPostRouter = (
  postController: ReturnType<typeof createPostController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/', postController.getAllPosts);
  router.get('/:id', postController.getPostById);

  router.post('/', authenticate, postController.createPost);
  router.put('/:id', authenticate, postController.updatePost);
  router.delete('/:id', authenticate, postController.deletePost);

  return router;
};
