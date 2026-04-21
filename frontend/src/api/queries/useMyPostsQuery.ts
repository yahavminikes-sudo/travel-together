import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@shared/types/post.types';

export const fetchMyPosts = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>('/api/users/me/posts', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const useMyPostsQuery = (options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts,
    ...options,
  });
};
