import axios, { AxiosError } from 'axios';

export const ACCESS_TOKEN_STORAGE_KEY = 'travel_together_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'travel_together_refresh_token';
export const USER_STORAGE_KEY = 'travel_together_user';

export interface ApiError {
  message: string;
  status?: number;
}

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Request failed',
      status: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Unknown error' };
};

export const isAbortError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.code === AxiosError.ERR_CANCELED;
};
