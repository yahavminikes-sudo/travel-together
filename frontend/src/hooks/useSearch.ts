import type { RAGResponse, SearchQuery, SearchResult } from '@shared/types';
import { useRef, useState } from 'react';
import { searchApi } from '@/services/api';
import { isAbortError, toApiError } from '@/services/apiClient';

interface UseSearchResult {
  results: SearchResult[];
  answer: RAGResponse | null;
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;
  search: (payload: SearchQuery) => Promise<SearchResult[]>;
  ask: (payload: SearchQuery) => Promise<RAGResponse | null>;
  clear: () => void;
}

export const useSearch = (): UseSearchResult => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState<RAGResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);

  const startRequest = () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller;
  };

  const handleSearchUnavailable = (message: string) => {
    setIsAvailable(false);
    setResults([]);
    setAnswer(null);
    setError(message);
  };

  const search = async (payload: SearchQuery) => {
    const controller = startRequest();
    setIsLoading(true);

    try {
      const response = await searchApi.search(payload, controller.signal);
      setResults(response);
      setAnswer(null);
      setError(null);
      setIsAvailable(true);
      return response;
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        return [];
      }

      const apiError = toApiError(caughtError);
      if (apiError.status === 404) {
        handleSearchUnavailable('Search is not available until the backend search endpoint is implemented.');
        return [];
      }

      setError(apiError.message);
      throw apiError;
    } finally {
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  };

  const ask = async (payload: SearchQuery) => {
    const controller = startRequest();
    setIsLoading(true);

    try {
      const response = await searchApi.ask(payload, controller.signal);
      setAnswer(response);
      setResults(response.contextUsed);
      setError(null);
      setIsAvailable(true);
      return response;
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        return null;
      }

      const apiError = toApiError(caughtError);
      if (apiError.status === 404) {
        handleSearchUnavailable('RAG search is not available until the backend search endpoint is implemented.');
        return null;
      }

      setError(apiError.message);
      throw apiError;
    } finally {
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  };

  const clear = () => {
    controllerRef.current?.abort();
    setResults([]);
    setAnswer(null);
    setError(null);
  };

  return {
    results,
    answer,
    isLoading,
    error,
    isAvailable,
    search,
    ask,
    clear,
  };
};
