import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { updatePost as updatePostRequest } from '@/api';

export interface UpdatePostData {
  destination: string;
  title: string;
  content: string;
  imageUrl: string;
}

export const updatePost = async ({ id, data }: { id: string; data: UpdatePostData }) => {
  return updatePostRequest(id, data);
};

export const useUpdatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, { id: string; data: UpdatePostData }, TOnMutateResult>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updatePost,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
