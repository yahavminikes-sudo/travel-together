import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IPostService } from '../../../../entities/IServices';
import { AuthRequest } from '../middlewares/authenticate';

export const createPostController = ({ postService }: { postService: IPostService }) => {
  const validatePaginationParams = (
    pageStr: string | undefined,
    limitStr: string | undefined
  ): { page: number; limit: number; valid: boolean; error?: string } => {
    let page = 1;
    let limit = 10;

    if (pageStr) {
      page = parseInt(pageStr);
      if (isNaN(page)) {
        return { page: 1, limit: 10, valid: false, error: 'page must be a number' };
      }
      if (page < 1) {
        return { page, limit, valid: false, error: 'page must be a positive integer' };
      }
    }

    if (limitStr) {
      limit = parseInt(limitStr);
      if (isNaN(limit)) {
        return { page, limit: 10, valid: false, error: 'limit must be a number' };
      }
      if (limit < 1) {
        return { page, limit, valid: false, error: 'limit must be a positive integer' };
      }
      if (limit > 100) {
        return { page, limit, valid: false, error: 'limit cannot exceed 100' };
      }
    }

    return { page, limit, valid: true };
  };

  return {
    getPosts: async (req: Request, res: Response) => {
      try {
        const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;
        const authorId = req.query.authorId as string | undefined;

        const validation = validatePaginationParams(pageStr, limitStr);
        if (!validation.valid) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: validation.error });
          return;
        }

        const options = { page: validation.page, limit: validation.limit };
        const result = authorId
          ? await postService.getPostsByUser(authorId, options)
          : await postService.getPosts(options);

        res.status(StatusCodes.OK).json(result);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    getPostById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        if (!post) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
          return;
        }
        res.status(StatusCodes.OK).json(post);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    createPost: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }
        const post = await postService.createPost(req.userId, req.body);
        res.status(StatusCodes.CREATED).json(post);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    updatePost: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        const { id } = req.params;
        const post = await postService.updatePost(id, req.body);
        if (!post) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
          return;
        }
        res.status(StatusCodes.OK).json(post);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    toggleLike: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        const { id } = req.params;
        const post = await postService.toggleLike(id, req.userId);

        if (!post) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
          return;
        }

        res.status(StatusCodes.OK).json(post);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    deletePost: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        const { id } = req.params;
        const success = await postService.deletePost(id);
        if (!success) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
          return;
        }
        res.status(StatusCodes.NO_CONTENT).send();
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
