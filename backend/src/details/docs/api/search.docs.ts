/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Semantic search management
 */

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
