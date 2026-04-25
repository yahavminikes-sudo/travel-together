import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || 'Internal server error'
  });
};
