import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUserService } from '../../../../entities/IServices';
import { AuthRequest } from '../middlewares/authenticate';

export const createUserController = ({ userService }: { userService: IUserService }) => {
  return {
    getProfile: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        const user = await userService.getUserProfile(req.userId);
        if (!user) {
          res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
          return;
        }
        res.status(StatusCodes.OK).json(user);
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    updateProfile: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
        const avatarUrl = typeof req.body?.avatarUrl === 'string' ? req.body.avatarUrl : undefined;
        if (username.length < 2) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username must be at least 2 characters long' });
          return;
        }

        const user = await userService.updateUserProfile(req.userId, { avatarUrl, username });
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
        const user = await userService.getUserById(id);
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
