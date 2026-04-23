import { IEmbeddingService, IPostService } from '../entities/IServices';
import { IPostRepository } from '../entities/IRepositories';
import { CreatePostDto, UpdatePostDto } from '@shared/post.types';
import { ContentType } from '@shared/search.types';

interface PostServiceDependencies {
  postRepository: IPostRepository;
  embeddingService: IEmbeddingService;
}

export const createPostService = ({ postRepository, embeddingService }: PostServiceDependencies): IPostService => {
  return {
    getAllPosts: async () => {
      return postRepository.findAll();
    },
    getPostById: async (id: string) => {
      return postRepository.findById(id);
    },
    createPost: async (authorId: string, postDto: CreatePostDto) => {
      const post = await postRepository.create(authorId, postDto);
      await embeddingService.indexContent(post._id, ContentType.Post, `${post.title} ${post.content}`);
      return post;
    },
    updatePost: async (id: string, postDto: UpdatePostDto) => {
      const post = await postRepository.update(id, postDto);
      if (post) {
        await embeddingService.indexContent(post._id, ContentType.Post, `${post.title} ${post.content}`);
      }
      return post;
    },
    deletePost: async (id: string) => {
      const success = await postRepository.delete(id);
      if (success) {
        await embeddingService.removeContent(id, ContentType.Post);
      }
      return success;
    }
  };
};
