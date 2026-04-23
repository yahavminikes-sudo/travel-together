import mongoose, { Schema } from 'mongoose';
import { Comment } from '@travel-together/shared/types/comment.types';

const commentSchema = new Schema<Omit<Comment, '_id' | 'author'>>({
  postId: { type: String, required: true, ref: 'Post' },
  authorId: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true },
}, { timestamps: true });

export const CommentModel = mongoose.model<Omit<Comment, '_id' | 'author'>>('Comment', commentSchema);
