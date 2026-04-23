import { ICommentRepository } from '../../../../entities/IRepositories';
import { CommentModel } from '../models/Comment.schema';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types/comment.types';
import { mapToComment } from '../utils/mappers';

export const createCommentRepository = (): ICommentRepository => ({
  findById: async (id: string): Promise<Comment | null> => {
    const doc = await CommentModel.findById(id).exec();
    return doc ? mapToComment(doc) : null;
  },

  findByPost: async (postId: string): Promise<Comment[]> => {
    const docs = await CommentModel.find({ postId }).sort({ createdAt: 1 }).exec();
    return docs.map(mapToComment);
  },

  create: async (postId: string, authorId: string, commentDto: CreateCommentDto): Promise<Comment> => {
    const doc = await CommentModel.create({ ...commentDto, postId, authorId });
    return mapToComment(doc);
  },

  update: async (id: string, commentDto: UpdateCommentDto): Promise<Comment | null> => {
    const doc = await CommentModel.findByIdAndUpdate(id, commentDto, { new: true }).exec();
    return doc ? mapToComment(doc) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await CommentModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
});
