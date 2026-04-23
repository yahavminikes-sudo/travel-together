import { IUserRepository } from '../../../../entities/IRepositories';
import { UserModel, IUserDocument } from '../models/User.schema';
import { User } from '@travel-together/shared/types/user.types';
import { mapToUser } from '../utils/mappers';

export const createUserRepository = (): IUserRepository => ({
  findById: async (id: string): Promise<User | null> => {
    const doc = await UserModel.findById(id).exec();
    return doc ? mapToUser(doc) : null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? mapToUser(doc) : null;
  },

  findByUsername: async (username: string): Promise<User | null> => {
    const doc = await UserModel.findOne({ username }).exec();
    return doc ? mapToUser(doc) : null;
  },

  create: async (user: Partial<User> & { password?: string }): Promise<User> => {
    const doc = await UserModel.create(user);
    return mapToUser(doc);
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const doc = await UserModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    return doc ? mapToUser(doc) : null;
  }
});
