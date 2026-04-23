import type { UpdateProfileDto, User } from '@travel-together/shared/types/user.types';
import { apiClient } from '@/api/client';

export const getProfile = async (signal?: AbortSignal) => {
  const response = await apiClient.get<User>('/api/users/profile', { signal });
  return response.data;
};

export const getUserById = async (userId: string, signal?: AbortSignal) => {
  const response = await apiClient.get<User>(`/api/users/${userId}`, { signal });
  return response.data;
};

export const updateProfile = async (data: UpdateProfileDto) => {
  const response = await apiClient.put<User>('/api/users/profile', data);
  return response.data;
};
