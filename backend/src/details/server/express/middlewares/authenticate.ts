import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../../../../entities/IAuthService';

export interface AuthRequest extends Request {
  userId?: string;
}

export const createAuthenticateMiddleware = (authService: IAuthService) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = authService.verifyToken(token);

    if (!payload || !payload._id) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is invalid or expired' });
      return;
    }

    req.userId = payload._id;
    next();
  };
};
