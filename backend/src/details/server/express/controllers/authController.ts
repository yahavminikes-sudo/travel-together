import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../../../../entities/IAuthService';
import { IAuthRepository } from '../../../../entities/IRepositories';

export const createAuthController = (deps: { authService: IAuthService; authRepository: IAuthRepository }) => {
  return {
    register: async (req: Request, res: Response) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
          return;
        }
        
        const existing = await deps.authRepository.findAuthRecordByEmail(email);
        if (existing) {
          res.status(StatusCodes.CONFLICT).json({ message: 'Email already registered' });
          return;
        }
        
        const hashedPassword = await deps.authService.hashPassword(password);
        const newRecord = await deps.authRepository.saveAuthRecord({
          _id: '', // Mongoose will auto-generate if empty
          username,
          email,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const tokens = deps.authService.generateTokens({ _id: newRecord._id, email: newRecord.email });
        newRecord.refreshTokens = [tokens.refreshToken];
        await deps.authRepository.saveAuthRecord(newRecord); // save tokens
        
        const { password: _, refreshTokens: __, ...publicUser } = newRecord;
        res.status(StatusCodes.CREATED).json({ user: publicUser, ...tokens });
      } catch (err) {
        console.error(err);
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
        
        const record = await deps.authRepository.findAuthRecordByEmail(email);
        if (!record || !record.password) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
          return;
        }
        
        const isValid = await deps.authService.comparePassword(password, record.password);
        if (!isValid) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
          return;
        }
        
        const tokens = deps.authService.generateTokens({ _id: record._id, email: record.email });
        record.refreshTokens = record.refreshTokens ? [...record.refreshTokens, tokens.refreshToken] : [tokens.refreshToken];
        await deps.authRepository.saveAuthRecord(record);
        
        const { password: _, refreshTokens: __, ...publicUser } = record;
        res.status(StatusCodes.OK).json({ user: publicUser, ...tokens });
      } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  };
};
