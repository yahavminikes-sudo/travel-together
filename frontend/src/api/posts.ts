import type { CreatePostDto, Post, UpdatePostDto } from '@travel-together/shared/types/post.types';
import { apiClient } from '@/api/client';
import type { PostEditorInput } from '@/api/types';
import { parseTags } from '@/api/utils';

export const getPosts = async (signal?: AbortSignal) => {
  const response = await apiClient.get<Post[]>('/api/posts', { signal });
  return response.data;
};

export const getPostById = async (postId: string, signal?: AbortSignal) => {
  const response = await apiClient.get<Post>(`/api/posts/${postId}`, { signal });
  return response.data;
};

export const createPost = async (data: CreatePostDto | PostEditorInput) => {
  const response = await apiClient.post<Post>('/api/posts', {
    ...data,
    imageUrl: data.imageUrl || undefined,
    tags: parseTags(data.tags),
  });
  return response.data;
};

export const updatePost = async (postId: string, data: UpdatePostDto | PostEditorInput) => {
  const response = await apiClient.put<Post>(`/api/posts/${postId}`, {
    ...data,
    imageUrl: data.imageUrl || undefined,
    tags: parseTags(data.tags),
  });
  return response.data;
};

export const deletePost = async (postId: string) => {
  await apiClient.delete(`/api/posts/${postId}`);
};

export const getMyPosts = async (userId: string, signal?: AbortSignal) => {
  const posts = await getPosts(signal);
  return posts.filter((post) => post.authorId === userId);
};
