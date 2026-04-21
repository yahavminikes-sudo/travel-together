import { ICommentService } from '../entities/IServices';
import { ICommentRepository } from '../entities/IRepositories';
import { CreateCommentDto, UpdateCommentDto } from '@shared/comment.types';

export const createCommentService = (deps: { commentRepository: ICommentRepository }): ICommentService => {
  return {
    getCommentsByPost: async (postId: string) => {
      return deps.commentRepository.findByPost(postId);
    },
    getCommentById: async (id: string) => {
      return deps.commentRepository.findById(id);
    },
    createComment: async (postId: string, authorId: string, commentDto: CreateCommentDto) => {
      // Future: Notification trigger to Post Owner
      return deps.commentRepository.create(postId, authorId, commentDto);
    },
    updateComment: async (id: string, commentDto: UpdateCommentDto) => {
      return deps.commentRepository.update(id, commentDto);
    },
    deleteComment: async (id: string) => {
      return deps.commentRepository.delete(id);
    }
  };
};
