import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IPostService } from '../../../../entities/IServices';
import { AuthRequest } from '../middlewares/authenticate';

export const createPostController = ({ postService }: { postService: IPostService }) => {
  return {
    getAllPosts: async (req: Request, res: Response) => {
      try {
        const posts = await postService.getAllPosts();
        res.status(StatusCodes.OK).json(posts);
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
