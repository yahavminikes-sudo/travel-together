import { apiClient } from '@/api/client';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<{ url: string }>('/api/uploads/image', formData);

  return response.data.url;
};
