import axios from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export interface LoginData {
  email: string;
  password: string;
}

export const loginMutationFn = async (data: LoginData) => {
  const response = await axios.post('/api/auth/login', data);
  return response.data;
};

export const useLoginMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<{ accessToken: string }, Error, LoginData, TOnMutateResult>
) => {
  return useMutation({
    mutationFn: loginMutationFn,
    ...options,
  });
};
