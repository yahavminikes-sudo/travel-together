import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { login } from '@/api';
import { AuthResponse, LoginCredentials } from '@travel-together/shared/types/auth.types';

export const loginMutationFn = async (data: LoginCredentials) => {
  return login(data);
};

export const useLoginMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<AuthResponse, Error, LoginCredentials, TOnMutateResult>
) => {
  return useMutation({
    mutationFn: loginMutationFn,
    ...options,
  });
};
