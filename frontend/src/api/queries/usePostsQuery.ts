import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@travel-together/shared/types/post.types';
import { getPosts } from '@/api';

export const fetchPosts = async (): Promise<Post[]> => {
  return getPosts();
};

export const usePostsQuery = (options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    ...options
  });
};
