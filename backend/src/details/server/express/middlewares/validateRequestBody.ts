import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';

export const validateRequestBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      res.status(StatusCodes.BAD_REQUEST).json({
        message: firstIssue?.message || 'Invalid request body'
      });
      return;
    }

    req.body = parseResult.data;
    next();
  };
};
