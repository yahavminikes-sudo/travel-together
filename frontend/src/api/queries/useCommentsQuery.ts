import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Comment } from '@travel-together/shared/types/comment.types';
import { getCommentsByPost } from '@/api';

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  return getCommentsByPost(postId);
};

export const useCommentsQuery = (postId: string, options?: Omit<UseQueryOptions<Comment[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    ...options,
  });
};
