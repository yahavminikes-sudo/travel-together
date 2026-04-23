import type { User } from '@travel-together/shared/types/user.types';
import { apiClient } from '@/api/client';

export const getProfile = async (signal?: AbortSignal) => {
  const response = await apiClient.get<User>('/api/users/profile', { signal });
  return response.data;
};
