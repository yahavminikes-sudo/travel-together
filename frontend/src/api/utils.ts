import type { Post } from '@travel-together/shared/types/post.types';

export const parseTags = (tags?: string[] | string) => {
  if (!tags) {
    return undefined;
  }

  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }

  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const buildSearchFallback = (posts: Post[], query: string, limit = 10): Post[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return posts
    .filter((post) => {
      const haystack = [post.title, post.content, post.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit);
};
