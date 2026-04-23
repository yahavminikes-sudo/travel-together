import mongoose, { Schema } from 'mongoose';
import { Post } from '@travel-together/shared/types/post.types';

const postSchema = new Schema<Omit<Post, '_id' | 'author' | 'commentCount'>>({
  authorId: { type: String, required: true, ref: 'User' },
  destination: { type: String, required: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likes: [{ type: String, ref: 'User' }], // Array of User IDs
  tags: [{ type: String }]
}, { timestamps: true });

export const PostModel = mongoose.model<Omit<Post, '_id' | 'author' | 'commentCount'>>('Post', postSchema);
