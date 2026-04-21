import mongoose, { Document, Schema } from 'mongoose';
import { Post } from '@shared/post.types';

export interface IPostDocument extends Omit<Post, '_id' | 'author' | 'createdAt' | 'updatedAt'>, Document {
  createdAt: string;
  updatedAt: string;
}

const postSchema = new Schema<IPostDocument>({
  authorId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likes: [{ type: String, ref: 'User' }], // Array of User IDs
  tags: [{ type: String }]
}, { timestamps: true });

export const PostModel = mongoose.model<IPostDocument>('Post', postSchema);
