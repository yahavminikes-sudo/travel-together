import axios from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerMutationFn = async (data: RegisterData) => {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
};

export const useRegisterMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<{ accessToken: string }, Error, RegisterData, TOnMutateResult>
) => {
  return useMutation({
    mutationFn: registerMutationFn,
    ...options,
  });
};
