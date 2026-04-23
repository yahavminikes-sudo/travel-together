import { IPostRepository } from '../../../../entities/IRepositories';
import { PostModel } from '../models/Post.schema';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { mapToPost } from '../utils/mappers';

export const createPostRepository = (): IPostRepository => ({
  findById: async (id: string): Promise<Post | null> => {
    const doc = await PostModel.findById(id).exec();
    return doc ? mapToPost(doc) : null;
  },

  findAll: async (): Promise<Post[]> => {
    const docs = await PostModel.find().sort({ createdAt: -1 }).exec();
    return docs.map(mapToPost);
  },

  create: async (authorId: string, postDto: CreatePostDto): Promise<Post> => {
    const doc = await PostModel.create({ ...postDto, authorId });
    return mapToPost(doc);
  },

  update: async (id: string, postDto: UpdatePostDto): Promise<Post | null> => {
    const doc = await PostModel.findByIdAndUpdate(id, postDto, { new: true }).exec();
    return doc ? mapToPost(doc) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await PostModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
});
