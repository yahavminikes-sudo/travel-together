import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Post } from '@travel-together/shared/types/post.types';
import { getMyPosts, getProfile, getStoredAuthToken } from '@/api';

export const fetchMyPosts = async (): Promise<Post[]> => {
  const token = getStoredAuthToken();

  if (!token) {
    return [];
  }

  const profile = await getProfile();
  if (!profile._id) {
    return [];
  }

  return getMyPosts(profile._id);
};

export const useMyPostsQuery = (options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts,
    ...options,
  });
};
