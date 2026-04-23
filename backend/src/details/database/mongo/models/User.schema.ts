import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@travel-together/shared/types/user.types';

export interface IUserDocument extends Omit<User, '_id' | 'createdAt' | 'updatedAt'>, Document {
  password?: string;
  refreshTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional if we plan OAuth in future
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  refreshTokens: [{ type: String, default: [] }]
}, { timestamps: true });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
