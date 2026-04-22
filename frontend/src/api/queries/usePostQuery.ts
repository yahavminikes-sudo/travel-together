import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@travel-together/shared/types/post.types';
import { getPostById } from '@/api';

export const fetchPost = async (id: string): Promise<Post> => {
  return getPostById(id);
};

export const usePostQuery = (id: string, options?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
    ...options,
  });
};
