import type { CreatePostDto, Post, UpdatePostDto } from '@shared/types';
import { apiClient } from '../apiClient';

export const postApi = {
  getAll: async (signal?: AbortSignal) => {
    const response = await apiClient.get<Post[]>('/posts', { signal });
    return response.data;
  },
  getById: async (id: string, signal?: AbortSignal) => {
    const response = await apiClient.get<Post>(`/posts/${id}`, { signal });
    return response.data;
  },
  create: async (payload: CreatePostDto, signal?: AbortSignal) => {
    const response = await apiClient.post<Post>('/posts', payload, { signal });
    return response.data;
  },
  update: async (id: string, payload: UpdatePostDto, signal?: AbortSignal) => {
    const response = await apiClient.put<Post>(`/posts/${id}`, payload, { signal });
    return response.data;
  },
  remove: async (id: string, signal?: AbortSignal) => {
    await apiClient.delete(`/posts/${id}`, { signal });
  },
};
