import { IAuthRepository } from '../../../../entities/IRepositories';
import { AuthRecord } from '../../../../entities/AuthRecord';
import { UserModel, IUserDocument } from '../models/User.schema';
import { User } from '@shared/user.types';
import { mapToUser } from '../utils/mappers';

export const createAuthRepository = (): IAuthRepository => ({
  findAuthRecordByEmail: async (email: string): Promise<AuthRecord | null> => {
    const doc = await UserModel.findOne({ email }).exec();
    if (!doc) return null;
    return {
      ...mapToUser(doc),
      password: doc.password,
      refreshTokens: doc.refreshTokens
    };
  },
  
  saveAuthRecord: async (record: AuthRecord): Promise<AuthRecord> => {
    const doc = await UserModel.findById(record._id).exec() || new UserModel();
    
    // Set protected fields specifically
    doc.username = record.username;
    doc.email = record.email;
    doc.password = record.password;
    doc.avatarUrl = record.avatarUrl || '';
    doc.bio = record.bio || '';
    doc.refreshTokens = record.refreshTokens || [];
    
    const saved = await doc.save();
    return {
      ...mapToUser(saved),
      password: saved.password,
      refreshTokens: saved.refreshTokens
    };
  }
});
