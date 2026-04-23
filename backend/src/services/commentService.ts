import { CreateCommentDto, UpdateCommentDto } from '@shared/comment.types';
import { ContentType } from '@shared/search.types';
import { ICommentRepository } from '../entities/IRepositories';
import { ICommentService, IEmbeddingService } from '../entities/IServices';

interface CommentServiceDependencies {
  commentRepository: ICommentRepository;
  embeddingService: IEmbeddingService;
}

export const createCommentService = ({ commentRepository, embeddingService }: CommentServiceDependencies): ICommentService => {
  return {
    getCommentsByPost: async (postId: string) => {
      return commentRepository.findByPost(postId);
    },
    getCommentById: async (id: string) => {
      return commentRepository.findById(id);
    },
    createComment: async (postId: string, authorId: string, commentDto: CreateCommentDto) => {
      const comment = await commentRepository.create(postId, authorId, commentDto);
      await embeddingService.indexContent(comment._id, ContentType.Comment, comment.content);
      return comment;
    },
    updateComment: async (id: string, commentDto: UpdateCommentDto) => {
      const comment = await commentRepository.update(id, commentDto);
      if (comment) {
        await embeddingService.indexContent(comment._id, ContentType.Comment, comment.content);
      }
      return comment;
    },
    deleteComment: async (id: string) => {
      const success = await commentRepository.delete(id);
      if (success) {
        await embeddingService.removeContent(id, ContentType.Comment);
      }
      return success;
    }
  };
};
