import { ICommentService, IEmbeddingService } from '../entities/IServices';
import { ICommentRepository } from '../entities/IRepositories';
import { ContentType, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types';

interface CommentServiceDependencies {
  commentRepository: ICommentRepository;
  embeddingService: IEmbeddingService;
}

export const createCommentService = ({
  commentRepository,
  embeddingService
}: CommentServiceDependencies): ICommentService => {
  return {
    getCommentsByPost: async (postId: string) => {
      return commentRepository.findByPost(postId);
    },
    getCommentById: async (id: string) => {
      return commentRepository.findById(id);
    },
    createComment: async (postId: string, authorId: string, commentDto: CreateCommentDto) => {
      const comment = await commentRepository.create(postId, authorId, commentDto);
      try {
        await embeddingService.indexContent(comment._id, ContentType.Comment, comment.content);
      } catch (err) {
        console.error('Embedding indexing failed for comment', comment._id, err);
      }
      return comment;
    },
    updateComment: async (id: string, commentDto: UpdateCommentDto) => {
      const comment = await commentRepository.update(id, commentDto);
      if (comment) {
        try {
          await embeddingService.indexContent(comment._id, ContentType.Comment, comment.content);
        } catch (err) {
          console.error('Embedding indexing failed for comment', comment._id, err);
        }
      }
      return comment;
    },
    deleteComment: async (id: string) => {
      const success = await commentRepository.delete(id);
      if (success) {
        try {
          await embeddingService.removeContent(id, ContentType.Comment);
        } catch (err) {
          console.error('Embedding removal failed for comment', id, err);
        }
      }
      return success;
    }
  };
};
