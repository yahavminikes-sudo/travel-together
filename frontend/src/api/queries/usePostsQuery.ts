import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@shared/types/post.types';

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>('/api/posts');
  
  return response.data;
};

export const usePostsQuery = (options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    ...options,
  });
};
