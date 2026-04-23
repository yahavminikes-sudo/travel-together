import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateCommentDto, Comment } from '@travel-together/shared/types/comment.types';
import type { Post } from '@travel-together/shared/types/post.types';
import type { CreatePostFormData, EditPostFormData } from '@travel-together/shared/schemas/postSchemas';
import {
  createComment,
  createPost,
  deletePost,
  getCommentsByPost,
  getMyPosts,
  getPostById,
  getPosts,
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
    queryFn: ({ signal }) => {
      if (!currentUser?._id) {
        return Promise.resolve([]);
      }

      return getMyPosts(currentUser._id, signal);
    },
    enabled: isAuthenticated && !!currentUser?._id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostFormData) => createPost(data),
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
    mutationFn: ({ data, id }: { id: string; data: EditPostFormData }) => updatePost(id, data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.setQueryData<Post>(['post', post._id], post);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.removeQueries({ queryKey: ['post', postId] });
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
      queryClient.setQueryData<Post | undefined>(['post', postId], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          commentCount: (current.commentCount ?? 0) + 1,
        };
      });
      queryClient.setQueryData<Post[]>(['posts'], (current = []) => {
        return current.map((post) =>
          post._id === postId
            ? { ...post, commentCount: (post.commentCount ?? 0) + 1 }
            : post
        );
      });
      queryClient.setQueryData<Post[]>(['myPosts'], (current = []) => {
        return current.map((post) =>
          post._id === postId
            ? { ...post, commentCount: (post.commentCount ?? 0) + 1 }
            : post
        );
      });
    },
  });
};
