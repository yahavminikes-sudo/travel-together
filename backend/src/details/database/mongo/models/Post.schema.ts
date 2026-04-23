import mongoose, { Schema } from 'mongoose';
import { Post } from '@travel-together/shared/types/post.types';

const postSchema = new Schema<Omit<Post, '_id' | 'author'>>({
  authorId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likes: [{ type: String, ref: 'User' }], // Array of User IDs
  tags: [{ type: String }]
}, { timestamps: true });

export const PostModel = mongoose.model<Omit<Post, '_id' | 'author'>>('Post', postSchema);
