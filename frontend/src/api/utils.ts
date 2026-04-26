import type { Post } from '@travel-together/shared/types/post.types';

export const buildSearchFallback = (posts: Post[], query: string, limit = 10): Post[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return posts
    .filter((post) => {
      const haystack = [post.destination, post.title, post.content].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit);
};
