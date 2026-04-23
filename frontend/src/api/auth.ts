import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@travel-together/shared/types/auth.types';
import { apiClient } from '@/api/client';

export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials) => {
  const response = await apiClient.post<AuthResponse>('/api/auth/register', credentials);
  return response.data;
};
