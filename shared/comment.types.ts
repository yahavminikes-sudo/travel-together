import { User } from './user.types';

export interface Comment {
  _id: string;
  postId: string;
  authorId: string;
  author?: User; // Populated author details
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
