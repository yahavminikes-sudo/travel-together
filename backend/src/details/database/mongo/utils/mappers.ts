import { User } from '@shared/user.types';
import { Post } from '@shared/post.types';
import { Comment } from '@shared/comment.types';
import { ICommentDocument } from '../models/Comment.schema';
import { IPostDocument } from '../models/Post.schema';
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

export const mapToPost = (doc: IPostDocument): Post => {
  return {
    _id: doc._id.toString(),
    authorId: doc.authorId.toString(),
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl ?? '',
    likes: (doc.likes ?? []).map((id) => id.toString()),
    tags: doc.tags ?? undefined,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
};

export const mapToComment = (doc: ICommentDocument): Comment => {
  return {
    _id: doc._id.toString(),
    postId: doc.postId.toString(),
    authorId: doc.authorId.toString(),
    content: doc.content,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
};
