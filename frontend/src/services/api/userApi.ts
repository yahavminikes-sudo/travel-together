import type { User } from '@shared/types';
import { apiClient } from '../apiClient';

export const userApi = {
  getProfile: async (signal?: AbortSignal) => {
    const response = await apiClient.get<User>('/users/profile', { signal });
    return response.data;
  },
  getById: async (id: string, signal?: AbortSignal) => {
    const response = await apiClient.get<User>(`/users/${id}`, { signal });
    return response.data;
  },
};
