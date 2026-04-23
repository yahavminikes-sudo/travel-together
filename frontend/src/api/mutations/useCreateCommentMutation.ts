import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@travel-together/shared/types/comment.types';
import { createComment } from '@/api';

export interface CreateCommentData {
  content: string;
}

export const postComment = async ({ postId, data }: { postId: string; data: CreateCommentData }): Promise<Comment> => {
  return createComment(postId, data);
};

export const useCreateCommentMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<Comment, Error, { postId: string; data: CreateCommentData }, TOnMutateResult>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: postComment,
    onSuccess: (data, variables, onMutateResult, context) => {
      // Update the comments cache after the server confirms creation.
      queryClient.setQueryData<Comment[]>(['comments', variables.postId], (old) => {
        return old ? [data, ...old] : [data];
      });
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};
