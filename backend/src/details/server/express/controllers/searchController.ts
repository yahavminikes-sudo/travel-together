import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IEmbeddingService } from '../../../../entities/IServices';
import { SearchQuery } from '@travel-together/shared/types/search.types';

const DEFAULT_TOP_K = 5;

export const createSearchController = ({ embeddingService }: { embeddingService: IEmbeddingService }) => {
  return {
    search: async (req: Request, res: Response) => {
      try {
        const searchQuery: SearchQuery = {
          query: req.query.q as string,
          limit: parseInt(req.query.limit as string) || DEFAULT_TOP_K
        };

        if (!searchQuery.query || searchQuery.query.trim().length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Query parameter "q" is required' });
          return;
        }

        const results = await embeddingService.search(searchQuery.query, searchQuery.limit);
        res.status(StatusCodes.OK).json(results);
      } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
