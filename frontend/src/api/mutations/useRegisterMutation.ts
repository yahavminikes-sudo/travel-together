import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { register } from '@/api';
import { AuthResponse, RegisterCredentials } from '@travel-together/shared/types/auth.types';

export const registerMutationFn = async (data: RegisterCredentials) => {
  return register(data);
};

export const useRegisterMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<AuthResponse, Error, RegisterCredentials, TOnMutateResult>
) => {
  return useMutation({
    mutationFn: registerMutationFn,
    ...options
  });
};
