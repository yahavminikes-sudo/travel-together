import { Router } from 'express';
import { createSearchController } from '../controllers/searchController';

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Semantic search management
 */

export const createSearchRouter = (searchController: ReturnType<typeof createSearchController>) => {
  const router = Router();

  /**
   * @swagger
   * /api/search:
   *   get:
   *     summary: Search for posts semantically
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of search results
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Post'
   */
  router.get('/', searchController.search);

  return router;
};
