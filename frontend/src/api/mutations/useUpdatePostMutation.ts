import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { updatePost as updatePostRequest } from '@/api';
import { EditPostFormData } from '@travel-together/shared/schemas/postSchemas';

export const updatePost = async ({ id, data }: { id: string; data: EditPostFormData }) => {
  return updatePostRequest(id, data);
};

export const useUpdatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, { id: string; data: EditPostFormData }, TOnMutateResult>
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
