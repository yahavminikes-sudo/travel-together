import mongoose, { Document, Schema } from 'mongoose';
import { Post } from '@travel-together/shared/types/post.types';
import { IUserDocument } from './User.schema';

export interface IPostDocument extends Omit<Post, '_id' | 'author' | 'commentCount' | 'createdAt' | 'updatedAt'>, Document {
  author?: IUserDocument;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

const postSchema = new Schema<IPostDocument>({
  authorId: { type: String, required: true, ref: 'User' },
  destination: { type: String, required: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likes: [{ type: String, ref: 'User' }], // Array of User IDs
  tags: [{ type: String }]
}, { timestamps: true });

export const PostModel = mongoose.model<IPostDocument>('Post', postSchema);
