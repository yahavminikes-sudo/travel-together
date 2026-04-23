import { Router, RequestHandler } from 'express';
import { createSearchController } from '../controllers/searchController';

export const createSearchRouter = (
  searchController: ReturnType<typeof createSearchController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.get('/', authenticate, searchController.search);

  return router;
};
