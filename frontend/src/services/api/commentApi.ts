import type { Comment, CreateCommentDto, UpdateCommentDto } from '@shared/types';
import { apiClient } from '../apiClient';

export const commentApi = {
  getByPost: async (postId: string, signal?: AbortSignal) => {
    const response = await apiClient.get<Comment[]>(`/comments/post/${postId}`, { signal });
    return response.data;
  },
  getById: async (id: string, signal?: AbortSignal) => {
    const response = await apiClient.get<Comment>(`/comments/${id}`, { signal });
    return response.data;
  },
  create: async (postId: string, payload: CreateCommentDto, signal?: AbortSignal) => {
    const response = await apiClient.post<Comment>(`/comments/${postId}`, payload, { signal });
    return response.data;
  },
  update: async (id: string, payload: UpdateCommentDto, signal?: AbortSignal) => {
    const response = await apiClient.put<Comment>(`/comments/${id}`, payload, { signal });
    return response.data;
  },
  remove: async (id: string, signal?: AbortSignal) => {
    await apiClient.delete(`/comments/${id}`, { signal });
  },
};
