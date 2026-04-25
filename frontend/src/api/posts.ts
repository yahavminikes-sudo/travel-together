import type { Post } from '@travel-together/shared/types/post.types';
import type { CreatePostFormData, EditPostFormData } from '@travel-together/shared/schemas/postSchemas';
import { apiClient } from '@/api/client';
import { parseTags } from '@/api/utils';

export const getPosts = async (signal?: AbortSignal) => {
  const response = await apiClient.get<Post[]>('/api/posts', { signal });
  return response.data;
};

export const getPostById = async (postId: string, signal?: AbortSignal) => {
  const response = await apiClient.get<Post>(`/api/posts/${postId}`, { signal });
  return response.data;
};

export const createPost = async (data: CreatePostFormData) => {
  const response = await apiClient.post<Post>('/api/posts', {
    ...data,
    tags: parseTags(data.tags)
  });
  return response.data;
};

export const updatePost = async (postId: string, data: EditPostFormData) => {
  const response = await apiClient.put<Post>(`/api/posts/${postId}`, {
    ...data,
    tags: parseTags(data.tags)
  });
  return response.data;
};

export const deletePost = async (postId: string) => {
  await apiClient.delete(`/api/posts/${postId}`);
};

export const togglePostLike = async (postId: string) => {
  const response = await apiClient.post<Post>(`/api/posts/${postId}/like`);
  return response.data;
};

export const getMyPosts = async (userId: string, signal?: AbortSignal) => {
  const posts = await getPosts(signal);
  return posts.filter((post) => post.authorId === userId);
};
