import { User } from '@travel-together/shared/types/user.types';
import { Post, CreatePostDto, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { Comment, CreateCommentDto, UpdateCommentDto } from '@travel-together/shared/types/comment.types';
import { AuthRecord } from './AuthRecord';

export interface IAuthRepository {
  findAuthRecordByEmail(email: string): Promise<AuthRecord | null>;
  saveAuthRecord(record: AuthRecord): Promise<AuthRecord>;
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
  findAll(): Promise<Post[]>;
  create(authorId: string, postDto: CreatePostDto): Promise<Post>;
  update(id: string, postDto: UpdatePostDto): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}

export interface ICommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPost(postId: string): Promise<Comment[]>;
  create(postId: string, authorId: string, commentDto: CreateCommentDto): Promise<Comment>;
  update(id: string, commentDto: UpdateCommentDto): Promise<Comment | null>;
  delete(id: string): Promise<boolean>;
}
