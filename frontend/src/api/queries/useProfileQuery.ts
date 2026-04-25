import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { User } from '@travel-together/shared/types/user.types';
import { getProfile } from '@/api';

export const fetchProfile = async (): Promise<User> => {
  return getProfile();
};

export const useProfileQuery = (options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    ...options
  });
};
