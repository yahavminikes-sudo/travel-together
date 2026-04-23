import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../../../../entities/IServices';

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error';
};

export const createAuthController = ({ authService }: { authService: IAuthService }) => {
  return {
    register: async (req: Request, res: Response) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
          return;
        }

        const result = await authService.register(req.body);
        res.status(StatusCodes.CREATED).json(result);
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        if (message === 'Email already registered') {
          res.status(StatusCodes.CONFLICT).json({ message });
          return;
        }
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    },

    login: async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing credentials' });
          return;
        }

        const result = await authService.login(req.body);
        res.status(StatusCodes.OK).json(result);
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        if (message === 'Invalid credentials') {
          res.status(StatusCodes.UNAUTHORIZED).json({ message });
          return;
        }
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
