import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { createPost as createPostRequest } from '@/api';
import { CreatePostFormData } from '@travel-together/shared/schemas/postSchemas';

export const createPost = async (data: CreatePostFormData) => {
  return createPostRequest(data);
};

export const useCreatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, CreatePostFormData, TOnMutateResult>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createPost,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
