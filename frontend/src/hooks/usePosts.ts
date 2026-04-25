import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { CreateCommentDto, Comment } from '@travel-together/shared/types/comment.types';
import type { Post } from '@travel-together/shared/types/post.types';
import type { PaginatedResponse } from '@travel-together/shared/types/pagination.types';
import type { CreatePostFormData, EditPostFormData } from '@travel-together/shared/schemas/postSchemas';
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getCommentsByPost,
  getMyPosts,
  getPostById,
  getPosts,
  togglePostLike,
  updatePost
} from '@/api';
import { useAuth } from '@/hooks/useAuth';

export const usePosts = (pageSize = 9) => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1, signal }) =>
      getPosts({ page: pageParam, limit: pageSize }, signal),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1
  });
};

export const usePost = (postId?: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: ({ signal }) => getPostById(postId as string, signal),
    enabled: !!postId
  });
};

export const useUserPosts = (userId?: string, pageSize = 9) => {
  return useInfiniteQuery({
    queryKey: ['userPosts', userId],
    queryFn: ({ pageParam = 1, signal }) => {
      if (!userId) {
        return Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: pageSize,
          hasMore: false
        } as PaginatedResponse<Post>);
      }

      return getMyPosts(userId, { page: pageParam, limit: pageSize }, signal);
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!userId
  });
};

export const useMyPosts = (pageSize = 9) => {
  const { currentUser } = useAuth();
  return useUserPosts(currentUser?._id, pageSize);
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostFormData) => createPost(data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', post.authorId] });
      queryClient.setQueryData<Post>(['post', post._id], post);
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { id: string; data: EditPostFormData }) => updatePost(id, data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', post.authorId] });
      queryClient.setQueryData<Post>(['post', post._id], post);
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.removeQueries({ queryKey: ['post', postId] });
    }
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onSuccess: (updatedPost) => {
      // Update infinite query posts
      queryClient.setQueryData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        ['posts'],
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => (post._id === updatedPost._id ? updatedPost : post))
            }))
          };
        }
      );
      queryClient.setQueryData<Post | undefined>(['post', updatedPost._id], updatedPost);
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        { queryKey: ['userPosts'] },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => (post._id === updatedPost._id ? updatedPost : post))
            }))
          };
        }
      );
    }
  });
};

export const useComments = (postId?: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: ({ signal }) => getCommentsByPost(postId as string, signal),
    enabled: !!postId
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
          commentCount: (current.commentCount ?? 0) + 1
        };
      });
      queryClient.setQueryData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        ['posts'],
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post._id === postId ? { ...post, commentCount: (post.commentCount ?? 0) + 1 } : post
              )
            }))
          };
        }
      );
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        { queryKey: ['userPosts'] },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post._id === postId ? { ...post, commentCount: (post.commentCount ?? 0) + 1 } : post
              )
            }))
          };
        }
      );
    }
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (current = []) => {
        return current.filter((comment) => comment._id !== commentId);
      });
      queryClient.setQueryData<Post | undefined>(['post', postId], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          commentCount: Math.max((current.commentCount ?? 0) - 1, 0)
        };
      });
      // Update infinite query posts
      queryClient.setQueryData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        ['posts'],
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post._id === postId ? { ...post, commentCount: Math.max((post.commentCount ?? 0) - 1, 0) } : post
              )
            }))
          };
        }
      );
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[]; pageParams: number[] }>(
        { queryKey: ['userPosts'] },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post._id === postId
                  ? { ...post, commentCount: Math.max((post.commentCount ?? 0) - 1, 0) }
                  : post
              )
            }))
          };
        }
      );
    }
  });
};
