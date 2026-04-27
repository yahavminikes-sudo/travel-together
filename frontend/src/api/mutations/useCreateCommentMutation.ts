import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Comment, CreateCommentDto } from '@travel-together/shared/types/comment.types';
import { createComment } from '@/api';

export const postComment = async ({ postId, data }: { postId: string; data: CreateCommentDto }): Promise<Comment> => {
  return createComment(postId, data);
};

export const useCreateCommentMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<Comment, Error, { postId: string; data: CreateCommentDto }, TOnMutateResult>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: postComment,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<Comment[]>(['comments', variables.postId], (old) => {
        return old ? [data, ...old] : [data];
      });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
