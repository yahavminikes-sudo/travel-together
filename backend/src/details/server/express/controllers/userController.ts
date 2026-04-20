import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUserRepository } from '../../../../entities/IRepositories';
import { AuthRequest } from '../middlewares/authenticate';

export const createUserController = (deps: { userRepository: IUserRepository }) => {
  return {
    getProfile: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }
        
        const user = await deps.userRepository.findById(req.userId);
        if (!user) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
          return;
        }
        res.status(StatusCodes.OK).json(user);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },
    
    getUserById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const user = await deps.userRepository.findById(id);
        if (!user) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
          return;
        }
        res.status(StatusCodes.OK).json(user);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
