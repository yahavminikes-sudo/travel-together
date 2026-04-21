import { User } from './user.types';

export interface Comment {
  _id: string;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content?: string;
}
