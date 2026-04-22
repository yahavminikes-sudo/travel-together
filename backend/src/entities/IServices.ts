import { User } from '@shared/user.types';
import { Post, CreatePostDto, UpdatePostDto } from '@shared/post.types';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@shared/comment.types';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@shared/auth.types';
import { ContentType, SearchResult } from '@shared/search.types';

export interface IAuthService {
  register(dto: RegisterCredentials): Promise<AuthResponse>;
  login(dto: LoginCredentials): Promise<AuthResponse>;
}

export interface IUserService {
  getUserProfile(userId: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}

export interface IPostService {
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  createPost(authorId: string, postDto: CreatePostDto): Promise<Post>;
  updatePost(id: string, postDto: UpdatePostDto): Promise<Post | null>;
  deletePost(id: string): Promise<boolean>;
}

export interface ICommentService {
  getCommentsByPost(postId: string): Promise<Comment[]>;
  getCommentById(id: string): Promise<Comment | null>;
  createComment(postId: string, authorId: string, commentDto: CreateCommentDto): Promise<Comment>;
  updateComment(id: string, commentDto: UpdateCommentDto): Promise<Comment | null>;
  deleteComment(id: string): Promise<boolean>;
}

export interface IEmbeddingService {
  indexContent(contentId: string, contentType: ContentType, text: string): Promise<void>;
  search(query: string, topK?: number): Promise<SearchResult[]>;
  removeContent(contentId: string, contentType: ContentType): Promise<void>;
}

