import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '@/api';

export const useSearch = (query: string, limit = 10) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ['search', normalizedQuery, limit],
    queryFn: ({ signal }) => searchPosts({ limit, query: normalizedQuery }, signal),
    enabled: normalizedQuery.length > 0
  });
};
