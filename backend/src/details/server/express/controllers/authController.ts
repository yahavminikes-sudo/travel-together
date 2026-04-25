import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../../../../entities/IServices';
import { GoogleAuthRequest } from '@travel-together/shared/types/auth.types';

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
    },

    googleLogin: async (req: Request<unknown, unknown, GoogleAuthRequest>, res: Response) => {
      try {
        const { credential } = req.body;
        if (!credential) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing Google credential' });
          return;
        }

        const result = await authService.googleLogin(req.body);
        res.status(StatusCodes.OK).json(result);
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        if (message === 'Invalid Google credential') {
          res.status(StatusCodes.UNAUTHORIZED).json({ message });
          return;
        }

        if (message === 'Google account conflict') {
          res.status(StatusCodes.CONFLICT).json({ message: 'A different Google account is already linked to this email' });
          return;
        }

        if (message === 'Google sign-in is not configured') {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
          return;
        }

        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
