import type { Post } from '@travel-together/shared/types/post.types';
import type { SearchResult } from '@travel-together/shared/types/search.types';
import { ContentType } from '@travel-together/shared/types/search.types';

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

export const buildSearchFallback = (posts: Post[], query: string, limit = 10): SearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return posts
    .map((post) => {
      const haystack = [post.title, post.content, post.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase();
      const occurrences = haystack.split(normalizedQuery).length - 1;

      return {
        contentId: post._id,
        contentType: ContentType.Post,
        textChunk: post.content.substring(0, 200),
        score: occurrences > 0 ? occurrences : haystack.includes(normalizedQuery) ? 0.5 : 0
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
};
