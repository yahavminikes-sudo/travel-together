import { ICommentService } from '../entities/IServices';
import { ICommentRepository } from '../entities/IRepositories';
import { CreateCommentDto, UpdateCommentDto } from '@shared/comment.types';

export const createCommentService = ({ commentRepository }: { commentRepository: ICommentRepository }): ICommentService => {
  return {
    getCommentsByPost: async (postId: string) => {
      return commentRepository.findByPost(postId);
    },
    getCommentById: async (id: string) => {
      return commentRepository.findById(id);
    },
    createComment: async (postId: string, authorId: string, commentDto: CreateCommentDto) => {
      // Future: Notification trigger to Post Owner
      return commentRepository.create(postId, authorId, commentDto);
    },
    updateComment: async (id: string, commentDto: UpdateCommentDto) => {
      return commentRepository.update(id, commentDto);
    },
    deleteComment: async (id: string) => {
      return commentRepository.delete(id);
    }
  };
};
