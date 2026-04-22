import { User } from '@travel-together/shared/types/user.types';
import { Post } from '@travel-together/shared/types/post.types';
import { Comment } from '@travel-together/shared/types/comment.types';
import { IUserDocument } from '../models/User.schema';

export const mapToUser = (doc: IUserDocument): User => {
  return {
    _id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    avatarUrl: doc.avatarUrl,
    bio: doc.bio,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
};

export const mapToPost = (doc: any): Post => {
  return {
    _id: doc._id.toString(),
    authorId: doc.authorId.toString(),
    author: doc.author ? mapToUser(doc.author) : undefined,
    commentCount: doc.commentCount ?? 0,
    destination: doc.destination,
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl,
    likes: doc.likes.map((id: any) => id.toString()),
    tags: doc.tags,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
};

export const mapToComment = (doc: any): Comment => {
  return {
    _id: doc._id.toString(),
    postId: doc.postId.toString(),
    authorId: doc.authorId.toString(),
    author: doc.author ? mapToUser(doc.author) : undefined,
    content: doc.content,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
};
