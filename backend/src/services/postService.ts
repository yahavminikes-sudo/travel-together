import { IPostService } from '../entities/IServices';
import { IPostRepository } from '../entities/IRepositories';
import { CreatePostDto, UpdatePostDto } from '@shared/post.types';

export const createPostService = ({ postRepository }: { postRepository: IPostRepository }): IPostService => {
  return {
    getAllPosts: async () => {
      return postRepository.findAll();
    },
    getPostById: async (id: string) => {
      return postRepository.findById(id);
    },
    createPost: async (authorId: string, postDto: CreatePostDto) => {
      // Future: Generate Gemini Embeddings here, broadcast to followers, etc.
      return postRepository.create(authorId, postDto);
    },
    updatePost: async (id: string, postDto: UpdatePostDto) => {
      return postRepository.update(id, postDto);
    },
    deletePost: async (id: string) => {
      // Future: Delete associated comments, remove from embeddings index, etc.
      return postRepository.delete(id);
    }
  };
};
