import { ICommentRepository, IPostRepository, IUserRepository } from '../../../../entities/IRepositories';
import { IPostDocument, PostModel } from '../models/Post.schema';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { PaginatedResponse, PaginationOptions } from '@travel-together/shared/types/pagination.types';
import { mapToPost } from '../utils/mappers';

export const createPostRepository = (
  userRepository: IUserRepository,
  commentRepository: ICommentRepository
): IPostRepository => {
  const enrichPost = async (doc: IPostDocument): Promise<Post> => {
    const [author, commentCount] = await Promise.all([
      userRepository.findById(doc.authorId),
      commentRepository.countByPost(doc._id.toString())
    ]);

    return mapToPost({
      ...doc.toObject(),
      author: author || undefined,
      commentCount
    });
  };

  return {
    findById: async (id: string): Promise<Post | null> => {
      const doc = await PostModel.findById(id).exec();
      return doc ? enrichPost(doc) : null;
    },

    findAll: async (options?: PaginationOptions): Promise<PaginatedResponse<Post>> => {
      const page = options?.page || 1;
      const limit = options?.limit || 10;

      const skip = (page - 1) * limit;
      const [docs, total] = await Promise.all([
        PostModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
        PostModel.countDocuments().exec()
      ]);

      const data = await Promise.all(docs.map(enrichPost));
      const hasMore = skip + limit < total;

      return {
        data,
        total,
        page,
        limit,
        hasMore
      };
    },

    findByUser: async (userId: string, options?: PaginationOptions): Promise<PaginatedResponse<Post>> => {
      const page = options?.page || 1;
      const limit = options?.limit || 10;

      const skip = (page - 1) * limit;
      const query = { authorId: userId };

      const [docs, total] = await Promise.all([
        PostModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
        PostModel.countDocuments(query).exec()
      ]);

      const data = await Promise.all(docs.map(enrichPost));
      const hasMore = skip + limit < total;

      return {
        data,
        total,
        page,
        limit,
        hasMore
      };
    },

    create: async (authorId: string, postDto: CreatePostDto): Promise<Post> => {
      const doc = await PostModel.create({ ...postDto, authorId });
      return enrichPost(doc);
    },

    update: async (id: string, postDto: UpdatePostDto): Promise<Post | null> => {
      const doc = await PostModel.findByIdAndUpdate(id, postDto, { new: true }).exec();
      return doc ? enrichPost(doc) : null;
    },

    toggleLike: async (postId: string, userId: string): Promise<Post | null> => {
      const existingPost = await PostModel.findById(postId).exec();

      if (!existingPost) {
        return null;
      }

      const hasLiked = existingPost.likes.includes(userId);
      const doc = await PostModel.findByIdAndUpdate(
        postId,
        hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
        { new: true }
      ).exec();

      return doc ? enrichPost(doc) : null;
    },

    delete: async (id: string): Promise<boolean> => {
      const result = await PostModel.findByIdAndDelete(id).exec();
      return result !== null;
    }
  };
};
