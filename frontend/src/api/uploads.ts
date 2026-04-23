import { apiClient } from '@/api/client';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to read image file.'));
    };

    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

export const uploadImage = async (file: File) => {
  const dataUrl = await fileToDataUrl(file);
  const response = await apiClient.post<{ url: string }>('/api/uploads/image', {
    dataUrl,
    filename: file.name,
  });

  return response.data.url;
};
