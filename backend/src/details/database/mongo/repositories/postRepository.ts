import { IPostRepository } from '../../../../entities/IRepositories';
import { CommentModel } from '../models/Comment.schema';
import { PostModel } from '../models/Post.schema';
import { UserModel } from '../models/User.schema';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { mapToPost, mapToUser } from '../utils/mappers';

const enrichPost = async (doc: any): Promise<Post> => {
  const [authorDoc, commentCount] = await Promise.all([
    UserModel.findById(doc.authorId).exec(),
    CommentModel.countDocuments({ postId: doc._id.toString() }).exec(),
  ]);

  return mapToPost({
    ...doc.toObject(),
    author: authorDoc ? mapToUser(authorDoc) : undefined,
    commentCount,
  });
};

export const createPostRepository = (): IPostRepository => ({
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
});
