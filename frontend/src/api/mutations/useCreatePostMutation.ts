import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { createPost as createPostRequest } from '@/api';

export interface CreatePostData {
  destination: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string;
}

export const createPost = async (data: CreatePostData) => {
  return createPostRequest(data);
};

export const useCreatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, CreatePostData, TOnMutateResult>
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
