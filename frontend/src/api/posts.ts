import type { Post } from '@travel-together/shared/types/post.types';
import type { CreatePostFormData, EditPostFormData } from '@travel-together/shared/schemas/postSchemas';
import type { PaginatedResponse, PaginationOptions } from '@travel-together/shared/types/pagination.types';
import { apiClient } from '@/api/client';

export const getPosts = async (options?: PaginationOptions, signal?: AbortSignal) => {
  const params = options ? { page: options.page, limit: options.limit } : {};
  const response = await apiClient.get<PaginatedResponse<Post>>('/api/posts', { params, signal });
  return response.data;
};

export const getPostById = async (postId: string, signal?: AbortSignal) => {
  const response = await apiClient.get<Post>(`/api/posts/${postId}`, { signal });
  return response.data;
};

export const createPost = async (data: CreatePostFormData) => {
  const response = await apiClient.post<Post>('/api/posts', data);
  return response.data;
};

export const updatePost = async (postId: string, data: EditPostFormData) => {
  const response = await apiClient.put<Post>(`/api/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: string) => {
  await apiClient.delete(`/api/posts/${postId}`);
};

export const togglePostLike = async (postId: string) => {
  const response = await apiClient.post<Post>(`/api/posts/${postId}/like`);
  return response.data;
};

export const getMyPosts = async (userId: string, options?: PaginationOptions, signal?: AbortSignal) => {
  const params = {
    authorId: userId,
    ...(options ? { page: options.page, limit: options.limit } : {})
  };
  const response = await apiClient.get<PaginatedResponse<Post>>('/api/posts', { params, signal });
  return response.data;
};
