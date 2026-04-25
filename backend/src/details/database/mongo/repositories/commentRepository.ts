import { ICommentRepository, IUserRepository } from '../../../../entities/IRepositories';
import { CommentModel, ICommentDocument } from '../models/Comment.schema';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types/comment.types';
import { mapToComment } from '../utils/mappers';

export const createCommentRepository = (userRepository: IUserRepository): ICommentRepository => {
  const enrichComment = async (doc: ICommentDocument): Promise<Comment> => {
    const author = await userRepository.findById(doc.authorId);

    return mapToComment({
      ...doc.toObject(),
      author: author || undefined
    });
  };

  return {
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

    countByPost: async (postId: string): Promise<number> => {
      return CommentModel.countDocuments({ postId }).exec();
    },

    delete: async (id: string): Promise<boolean> => {
      const result = await CommentModel.findByIdAndDelete(id).exec();
      return result !== null;
    }
  };
};
