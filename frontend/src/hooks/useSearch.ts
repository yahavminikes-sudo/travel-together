import { useInfiniteQuery } from '@tanstack/react-query';
import { searchPosts } from '@/api';

export const useSearch = (query: string, pageSize = 9) => {
  const normalizedQuery = query.trim();

  return useInfiniteQuery({
    queryKey: ['search', normalizedQuery],
    queryFn: ({ pageParam = 1, signal }) =>
      searchPosts({ limit: pageSize, query: normalizedQuery }, { page: pageParam, limit: pageSize }, signal),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: normalizedQuery.length > 0,
    initialPageParam: 1
  });
};
