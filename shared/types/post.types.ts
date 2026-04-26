import { User } from './user.types';

export interface Post {
  _id: string;
  authorId: string;
  author?: User;
  commentCount: number;
  destination: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  destination: string;
  title: string;
  content: string;
  imageUrl: string;
}

export interface UpdatePostDto {
  destination: string;
  title: string;
  content: string;
  imageUrl: string;
}
