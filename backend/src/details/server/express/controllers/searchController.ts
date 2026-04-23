import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IEmbeddingService } from '../../../../entities/IServices';

const DEFAULT_TOP_K = 5;

export const createSearchController = ({ embeddingService }: { embeddingService: IEmbeddingService }) => {
  return {
    search: async (req: Request, res: Response) => {
      try {
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Query parameter "q" is required' });
          return;
        }

        const topK = parseInt(req.query.topK as string) || DEFAULT_TOP_K;
        const results = await embeddingService.search(query, topK);
        res.status(StatusCodes.OK).json(results);
      } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
