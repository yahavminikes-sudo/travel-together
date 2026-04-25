import { User } from '@travel-together/shared/types/user.types';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types/comment.types';
import { AuthRecord } from './AuthRecord';
import { ContentType } from '@travel-together/shared/types/search.types';
import { PaginatedResponse, PaginationOptions } from '@travel-together/shared/types/pagination.types';

export interface IAuthRepository {
  findAuthRecordByEmail(email: string): Promise<AuthRecord | null>;
  findAuthRecordByGoogleId(googleId: string): Promise<AuthRecord | null>;
  findAuthRecordByUsername(username: string): Promise<AuthRecord | null>;
  saveAuthRecord(record: Omit<AuthRecord, '_id'> & Partial<Pick<AuthRecord, '_id'>>): Promise<AuthRecord>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
}

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResponse<Post>>;
  findByUser(userId: string, options?: PaginationOptions): Promise<PaginatedResponse<Post>>;
  create(authorId: string, postDto: CreatePostDto): Promise<Post>;
  update(id: string, postDto: UpdatePostDto): Promise<Post | null>;
  toggleLike(postId: string, userId: string): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}

export interface ICommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPost(postId: string): Promise<Comment[]>;
  create(postId: string, authorId: string, commentDto: CreateCommentDto): Promise<Comment>;
  update(id: string, commentDto: UpdateCommentDto): Promise<Comment | null>;
  countByPost(postId: string): Promise<number>;
  delete(id: string): Promise<boolean>;
}

export interface EmbeddingRecord {
  _id: string;
  contentId: string;
  contentType: ContentType;
  textChunk: string;
  embedding: number[];
}

export interface IEmbeddingRepository {
  save(record: Omit<EmbeddingRecord, '_id'>): Promise<EmbeddingRecord>;
  findAll(): Promise<EmbeddingRecord[]>;
  deleteByContent(contentId: string, contentType: ContentType): Promise<boolean>;
}
