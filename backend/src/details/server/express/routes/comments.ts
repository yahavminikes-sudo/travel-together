import { Router, RequestHandler } from 'express';
import { createCommentController } from '../controllers/commentController';

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

export const createCommentRouter = (
  commentController: ReturnType<typeof createCommentController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  /**
   * @swagger
   * /api/comments/post/{postId}:
   *   get:
   *     summary: Get all comments for a post
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: postId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of comments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Comment'
   */
  router.get('/post/:postId', commentController.getCommentsByPost);

  /**
   * @swagger
   * /api/comments/{id}:
   *   get:
   *     summary: Get comment by ID
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Comment details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       404:
   *         description: Comment not found
   */
  router.get('/:id', commentController.getCommentById);

  /**
   * @swagger
   * /api/comments/post/{postId}:
   *   post:
   *     summary: Create a new comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       201:
   *         description: Comment created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       401:
   *         description: Unauthorized
   */
  router.post('/post/:postId', authenticate, commentController.createComment);

  /**
   * @swagger
   * /api/comments/{id}:
   *   put:
   *     summary: Update a comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Comment updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Comment not found
   */
  router.put('/:id', authenticate, commentController.updateComment);

  /**
   * @swagger
   * /api/comments/{id}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Comment deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Comment not found
   */
  router.delete('/:id', authenticate, commentController.deleteComment);

  return router;
};
