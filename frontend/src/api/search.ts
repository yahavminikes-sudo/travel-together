import { AxiosError } from 'axios';
import type { SearchQuery, SearchResult } from '@travel-together/shared/types/search.types';
import { apiClient } from '@/api/client';
import { getPosts } from '@/api/posts';
import { buildSearchFallback } from '@/api/utils';

export const searchPosts = async ({ limit = 10, query }: SearchQuery, signal?: AbortSignal) => {
  try {
    const response = await apiClient.get<SearchResult[]>('/api/search', {
      params: { q: query, limit },
      signal
    });

    return response.data;
  } catch (error) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    if (status === 404) {
      const posts = await getPosts(signal);
      return buildSearchFallback(posts, query, limit);
    }

    throw error;
  }
};
