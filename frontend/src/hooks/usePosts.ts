import type { CreatePostDto, Post, UpdatePostDto } from '@shared/types';
import { useEffect, useRef, useState } from 'react';
import { postApi } from '@/services/api';
import { isAbortError, toApiError } from '@/services/apiClient';

interface UsePostsOptions {
  autoFetch?: boolean;
}

interface UsePostsResult {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<Post[]>;
  fetchPostById: (id: string) => Promise<Post | null>;
  createPost: (payload: CreatePostDto) => Promise<Post>;
  updatePost: (id: string, payload: UpdatePostDto) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  clearSelectedPost: () => void;
}

export const usePosts = ({ autoFetch = true }: UsePostsOptions = {}): UsePostsResult => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const startRequest = () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller;
  };

  const fetchPosts = async () => {
    const controller = startRequest();
    setIsLoading(true);

    try {
      const result = await postApi.getAll(controller.signal);
      setPosts(result);
      setError(null);
      return result;
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        return [];
      }

      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  };

  const fetchPostById = async (id: string) => {
    const controller = startRequest();
    setIsLoading(true);

    try {
      const result = await postApi.getById(id, controller.signal);
      setSelectedPost(result);
      setError(null);
      return result;
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        return null;
      }

      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  };

  const createPost = async (payload: CreatePostDto) => {
    setIsLoading(true);

    try {
      const createdPost = await postApi.create(payload);
      setPosts((currentPosts) => [createdPost, ...currentPosts]);
      setSelectedPost(createdPost);
      setError(null);
      return createdPost;
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (id: string, payload: UpdatePostDto) => {
    setIsLoading(true);

    try {
      const updatedPost = await postApi.update(id, payload);
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post._id === id ? updatedPost : post)),
      );
      setSelectedPost((currentPost) => (currentPost?._id === id ? updatedPost : currentPost));
      setError(null);
      return updatedPost;
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setIsLoading(true);

    try {
      await postApi.remove(id);
      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== id));
      setSelectedPost((currentPost) => (currentPost?._id === id ? null : currentPost));
      setError(null);
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedPost = () => setSelectedPost(null);

  useEffect(() => {
    if (!autoFetch) {
      setIsLoading(false);
      return;
    }

    void fetchPosts();

    return () => {
      controllerRef.current?.abort();
    };
  }, [autoFetch]);

  return {
    posts,
    selectedPost,
    isLoading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    clearSelectedPost,
  };
};
