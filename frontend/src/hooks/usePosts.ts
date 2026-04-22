import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateCommentDto, Comment } from '@travel-together/shared/types/comment.types';
import type { Post } from '@travel-together/shared/types/post.types';
import {
  createComment,
  createPost,
  getCommentsByPost,
  getMyPosts,
  getPostById,
  getPosts,
  type PostEditorInput,
  updatePost,
} from '@/api';
import { useAuth } from '@/hooks/useAuth';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: ({ signal }) => getPosts(signal),
  });
};

export const usePost = (postId?: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: ({ signal }) => getPostById(postId as string, signal),
    enabled: !!postId,
  });
};

export const useMyPosts = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['myPosts', currentUser?._id],
    queryFn: ({ signal }) => getMyPosts(currentUser!._id, signal),
    enabled: isAuthenticated && !!currentUser?._id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostEditorInput) => createPost(data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.setQueryData<Post>(['post', post._id], post);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { id: string; data: PostEditorInput }) => updatePost(id, data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.setQueryData<Post>(['post', post._id], post);
    },
  });
};

export const useComments = (postId?: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: ({ signal }) => getCommentsByPost(postId as string, signal),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment(postId, data),
    onSuccess: (comment) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (current = []) => {
        return [comment, ...current];
      });
    },
  });
};
