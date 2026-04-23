import { ICommentRepository } from '../../../../entities/IRepositories';
import { CommentModel } from '../models/Comment.schema';
import { UserModel } from '../models/User.schema';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types/comment.types';
import { mapToComment, mapToUser } from '../utils/mappers';

const enrichComment = async (doc: any): Promise<Comment> => {
  const authorDoc = await UserModel.findById(doc.authorId).exec();

  return mapToComment({
    ...doc.toObject(),
    author: authorDoc ? mapToUser(authorDoc) : undefined,
  });
};

export const createCommentRepository = (): ICommentRepository => ({
  findById: async (id: string): Promise<Comment | null> => {
    const doc = await CommentModel.findById(id).exec();
    return doc ? enrichComment(doc) : null;
  },

  findByPost: async (postId: string): Promise<Comment[]> => {
    const docs = await CommentModel.find({ postId }).sort({ createdAt: -1 }).exec();
    return Promise.all(docs.map(enrichComment));
  },

  create: async (postId: string, authorId: string, commentDto: CreateCommentDto): Promise<Comment> => {
    const doc = await CommentModel.create({ ...commentDto, postId, authorId });
    return enrichComment(doc);
  },

  update: async (id: string, commentDto: UpdateCommentDto): Promise<Comment | null> => {
    const doc = await CommentModel.findByIdAndUpdate(id, commentDto, { new: true }).exec();
    return doc ? enrichComment(doc) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await CommentModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
});
