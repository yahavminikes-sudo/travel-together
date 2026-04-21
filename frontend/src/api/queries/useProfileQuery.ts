import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { User } from '@shared/types/user.types';

export const fetchProfile = async (): Promise<User> => {
  const response = await axios.get<User>('/api/users/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const useProfileQuery = (options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    ...options,
  });
};
