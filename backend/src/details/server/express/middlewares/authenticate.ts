import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface AuthRequest extends Request {
  userId?: string;
}

export const createAuthenticateMiddleware = (authenticator: (token: string) => string | null) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const userId = authenticator(token);

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is invalid or expired' });
      return;
    }

    req.userId = userId;
    next();
  };
};
