import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@shared/types';
import { apiClient } from '../apiClient';

export const authApi = {
  login: async (credentials: LoginCredentials, signal?: AbortSignal) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, { signal });
    return response.data;
  },
  register: async (credentials: RegisterCredentials, signal?: AbortSignal) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials, { signal });
    return response.data;
  },
};
