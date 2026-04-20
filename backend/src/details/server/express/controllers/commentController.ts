import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ICommentRepository } from '../../../../entities/IRepositories';
import { AuthRequest } from '../middlewares/authenticate';

export const createCommentController = (deps: { commentRepository: ICommentRepository }) => {
  return {
    getCommentsByPost: async (req: Request, res: Response) => {
      try {
        const { postId } = req.params;
        const comments = await deps.commentRepository.findByPost(postId);
        res.status(StatusCodes.OK).json(comments);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },
    
    getCommentById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const comment = await deps.commentRepository.findById(id);
        if (!comment) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });
          return;
        }
        res.status(StatusCodes.OK).json(comment);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },
    
    createComment: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }
        const { postId } = req.params; // Or from body depending on route structure
        const comment = await deps.commentRepository.create(postId, req.userId, req.body);
        res.status(StatusCodes.CREATED).json(comment);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },
    
    updateComment: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }
        
        const { id } = req.params;
        const comment = await deps.commentRepository.update(id, req.body);
        if (!comment) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });
          return;
        }
        res.status(StatusCodes.OK).json(comment);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },
    
    deleteComment: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }
        
        const { id } = req.params;
        const success = await deps.commentRepository.delete(id);
        if (!success) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });
          return;
        }
        res.status(StatusCodes.NO_CONTENT).send();
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
