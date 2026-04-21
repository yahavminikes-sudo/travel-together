import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@shared/types/post.types';

export const fetchPost = async (id: string): Promise<Post> => {
  const response = await axios.get<Post>(`/api/posts/${id}`);
  return response.data;
};

export const usePostQuery = (id: string, options?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
    ...options,
  });
};
