import type { Comment, CreateCommentDto } from '@travel-together/shared/types/comment.types';
import { apiClient } from '@/api/client';

export const getCommentsByPost = async (postId: string, signal?: AbortSignal) => {
  const response = await apiClient.get<Comment[]>(`/api/comments/post/${postId}`, { signal });
  return response.data;
};

export const createComment = async (postId: string, data: CreateCommentDto) => {
  const response = await apiClient.post<Comment>(`/api/comments/${postId}`, data);
  return response.data;
};
