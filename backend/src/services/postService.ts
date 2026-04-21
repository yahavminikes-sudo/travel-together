import { IPostService } from '../entities/IServices';
import { IPostRepository } from '../entities/IRepositories';
import { CreatePostDto, UpdatePostDto } from '@shared/post.types';

export const createPostService = (deps: { postRepository: IPostRepository }): IPostService => {
  return {
    getAllPosts: async () => {
      return deps.postRepository.findAll();
    },
    getPostById: async (id: string) => {
      return deps.postRepository.findById(id);
    },
    createPost: async (authorId: string, postDto: CreatePostDto) => {
      // Future: Generate Gemini Embeddings here, broadcast to followers, etc.
      return deps.postRepository.create(authorId, postDto);
    },
    updatePost: async (id: string, postDto: UpdatePostDto) => {
      return deps.postRepository.update(id, postDto);
    },
    deletePost: async (id: string) => {
      // Future: Delete associated comments, remove from embeddings index, etc.
      return deps.postRepository.delete(id);
    }
  };
};
