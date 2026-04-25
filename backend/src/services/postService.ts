import { IEmbeddingService, IPostService } from '../entities/IServices';
import { IPostRepository } from '../entities/IRepositories';
import { CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { ContentType } from '@travel-together/shared/types/search.types';

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
      try {
        const contentToIndex = [post.destination, post.title, post.content, ...(post.tags ?? [])]
          .filter(Boolean)
          .join(' ');
        await embeddingService.indexContent(post._id, ContentType.Post, contentToIndex);
      } catch (err) {
        console.error('Embedding indexing failed for post', post._id, err);
      }
      return post;
    },
    updatePost: async (id: string, postDto: UpdatePostDto) => {
      const post = await postRepository.update(id, postDto);
      if (post) {
        try {
          const contentToIndex = [post.destination, post.title, post.content, ...(post.tags ?? [])]
            .filter(Boolean)
            .join(' ');
          await embeddingService.indexContent(post._id, ContentType.Post, contentToIndex);
        } catch (err) {
          console.error('Embedding indexing failed for post', post._id, err);
        }
      }
      return post;
    },
    deletePost: async (id: string) => {
      const success = await postRepository.delete(id);
      if (success) {
        try {
          await embeddingService.removeContent(id, ContentType.Post);
        } catch (err) {
          console.error('Embedding removal failed for post', id, err);
        }
      }
      return success;
    }
  };
};
