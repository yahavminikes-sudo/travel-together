import type { RAGResponse, SearchQuery, SearchResult } from '@shared/types';
import { apiClient } from '../apiClient';

export const searchApi = {
  search: async (payload: SearchQuery, signal?: AbortSignal) => {
    const response = await apiClient.post<SearchResult[]>('/search', payload, { signal });
    return response.data;
  },
  ask: async (payload: SearchQuery, signal?: AbortSignal) => {
    const response = await apiClient.post<RAGResponse>('/search/rag', payload, { signal });
    return response.data;
  },
};
