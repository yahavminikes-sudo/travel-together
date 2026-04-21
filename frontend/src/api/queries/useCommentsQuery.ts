import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Comment } from '@shared/types/comment.types';

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`/api/posts/${postId}/comments`);
  return response.data;
};

export const useCommentsQuery = (postId: string, options?: Omit<UseQueryOptions<Comment[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    ...options,
  });
};
