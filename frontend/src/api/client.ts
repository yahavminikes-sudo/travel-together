import axios from 'axios';

export const AUTH_TOKEN_STORAGE_KEY = 'token';

export const getStoredAuthToken = (): string | null => {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const setStoredAuthToken = (token: string) => {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const clearStoredAuthToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    Accept: 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong while contacting the server.';

    return Promise.reject(new Error(message));
  }
);
