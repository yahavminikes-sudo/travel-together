import { AuthRecord } from '../../../../entities/AuthRecord';
import { IAuthRepository } from '../../../../entities/IRepositories';
import { UserModel } from '../models/User.schema';
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
    const doc = record._id ? await UserModel.findById(record._id).exec() : null;
    const finalDoc = doc || new UserModel();

    finalDoc.username = record.username;
    finalDoc.email = record.email;
    finalDoc.password = record.password;
    finalDoc.avatarUrl = record.avatarUrl || '';
    finalDoc.bio = record.bio || '';
    finalDoc.refreshTokens = record.refreshTokens || [];

    const saved = await finalDoc.save();
    return {
      ...mapToUser(saved),
      password: saved.password,
      refreshTokens: saved.refreshTokens
    };
  }
});
