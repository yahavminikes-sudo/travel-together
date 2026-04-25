import { AxiosError } from 'axios';
import type { SearchQuery } from '@travel-together/shared/types/search.types';
import type { PaginatedResponse, PaginationOptions } from '@travel-together/shared/types/pagination.types';
import { apiClient } from '@/api/client';
import { getPosts } from '@/api/posts';
import { buildSearchFallback } from '@/api/utils';
import { Post } from '@travel-together/shared/types/post.types';

export const searchPosts = async (
  { query }: SearchQuery,
  options?: PaginationOptions,
  signal?: AbortSignal
) => {
  try {
    const params = {
      q: query,
      ...(options && { page: options.page, limit: options.limit })
    };
    const response = await apiClient.get<PaginatedResponse<Post>>('/api/search', {
      params,
      signal
    });

    return response.data;
  } catch (error) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    if (status === 404) {
      const result = await getPosts(undefined, signal);
      const filtered = buildSearchFallback(result.data, query, 100);
      const page = options?.page || 1;
      const pageLimit = options?.limit || 5;
      const start = (page - 1) * pageLimit;
      const end = start + pageLimit;

      return {
        data: filtered.slice(start, end),
        total: filtered.length,
        page,
        limit: pageLimit,
        hasMore: end < filtered.length
      };
    }

    throw error;
  }
};
