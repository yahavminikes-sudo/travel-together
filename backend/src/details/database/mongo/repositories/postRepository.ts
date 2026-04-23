import { ICommentRepository, IPostRepository, IUserRepository } from '../../../../entities/IRepositories';
import { IPostDocument, PostModel } from '../models/Post.schema';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { mapToPost } from '../utils/mappers';

export const createPostRepository = (userRepository: IUserRepository, commentRepository: ICommentRepository): IPostRepository => {
  const enrichPost = async (doc: IPostDocument): Promise<Post> => {
    const [author, commentCount] = await Promise.all([
      userRepository.findById(doc.authorId),
      commentRepository.countByPost(doc._id.toString()),
    ]);

    return mapToPost({
      ...doc.toObject(),
      author: author || undefined,
      commentCount,
    });
  };

  return {
    findById: async (id: string): Promise<Post | null> => {
      const doc = await PostModel.findById(id).exec();
      return doc ? enrichPost(doc) : null;
    },

    findAll: async (): Promise<Post[]> => {
      const docs = await PostModel.find().sort({ createdAt: -1 }).exec();
      return Promise.all(docs.map(enrichPost));
    },

    create: async (authorId: string, postDto: CreatePostDto): Promise<Post> => {
      const doc = await PostModel.create({ ...postDto, authorId });
      return enrichPost(doc);
    },

    update: async (id: string, postDto: UpdatePostDto): Promise<Post | null> => {
      const doc = await PostModel.findByIdAndUpdate(id, postDto, { new: true }).exec();
      return doc ? enrichPost(doc) : null;
    },

    delete: async (id: string): Promise<boolean> => {
      const result = await PostModel.findByIdAndDelete(id).exec();
      return result !== null;
    }
  };
};
