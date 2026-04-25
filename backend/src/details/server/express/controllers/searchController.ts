import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IEmbeddingService, IPostService } from '../../../../entities/IServices';

const DEFAULT_LIMIT = 5;

export const createSearchController = ({
  embeddingService,
  postService
}: {
  embeddingService: IEmbeddingService;
  postService: IPostService;
}) => {
  const validatePaginationParams = (
    pageStr: string | undefined,
    limitStr: string | undefined
  ): { page: number; limit: number; valid: boolean; error?: string } => {
    let page = 1;
    let limit = DEFAULT_LIMIT;

    if (pageStr) {
      page = parseInt(pageStr);
      if (isNaN(page)) {
        return { page: 1, limit: DEFAULT_LIMIT, valid: false, error: 'page must be a number' };
      }
      if (page < 1) {
        return { page, limit, valid: false, error: 'page must be a positive integer' };
      }
    }

    if (limitStr) {
      limit = parseInt(limitStr);
      if (isNaN(limit)) {
        return { page, limit: DEFAULT_LIMIT, valid: false, error: 'limit must be a number' };
      }
      if (limit < 1) {
        return { page, limit, valid: false, error: 'limit must be a positive integer' };
      }
      if (limit > 50) {
        return { page, limit, valid: false, error: 'limit cannot exceed 50' };
      }
    }

    return { page, limit, valid: true };
  };

  return {
    search: async (req: Request, res: Response) => {
      try {
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Query parameter "q" is required' });
          return;
        }

        const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;

        const validation = validatePaginationParams(pageStr, limitStr);
        if (!validation.valid) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: validation.error });
          return;
        }

        const results = await embeddingService.search(query);

        const startIdx = (validation.page - 1) * validation.limit;
        const endIdx = validation.page * validation.limit;
        const paginatedResults = results.slice(startIdx, endIdx);

        const enrichedResults = await Promise.all(
          paginatedResults.map(async (result) => {
            try {
              return await postService.getPostById(result.contentId);
            } catch (err) {
              return null;
            }
          })
        );

        const validPosts = enrichedResults.filter((post) => post !== null);

        const total = results.length;
        const hasMore = endIdx < total;

        res.status(StatusCodes.OK).json({
          data: validPosts,
          total,
          page: validation.page,
          limit: validation.limit,
          hasMore
        });
      } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
