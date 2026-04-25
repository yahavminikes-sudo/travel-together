import { Router, RequestHandler } from 'express';
import { createPostSchema, editPostSchema } from '@travel-together/shared/schemas/postSchemas';
import { createPostController } from '../controllers/postController';
import { validateRequestBody } from '../middlewares/validateRequestBody';

export const createPostRouter = (
  postController: ReturnType<typeof createPostController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/', postController.getAllPosts);
  router.get('/:id', postController.getPostById);
  router.post('/', authenticate, validateRequestBody(createPostSchema), postController.createPost);
  router.post('/:id/like', authenticate, postController.toggleLike);
  router.put('/:id', authenticate, validateRequestBody(editPostSchema), postController.updatePost);
  router.delete('/:id', authenticate, postController.deletePost);

  return router;
};
