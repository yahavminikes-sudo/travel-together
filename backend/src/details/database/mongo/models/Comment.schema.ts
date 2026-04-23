import mongoose, { Document, Schema } from 'mongoose';
import { Comment } from '@travel-together/shared/types/comment.types';
import { IUserDocument } from './User.schema';

export interface ICommentDocument extends Omit<Comment, '_id' | 'author' | 'createdAt' | 'updatedAt'>, Document {
  author?: IUserDocument;
  createdAt: string;
  updatedAt: string;
}

const commentSchema = new Schema<ICommentDocument>({
  postId: { type: String, required: true, ref: 'Post' },
  authorId: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true },
}, { timestamps: true });

export const CommentModel = mongoose.model<ICommentDocument>('Comment', commentSchema);

