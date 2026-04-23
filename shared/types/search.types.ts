export const ContentType = {
  Post: 'Post',
  Comment: 'Comment'
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export interface SearchQuery {
  query: string;
  limit?: number;
}

export interface SearchResult {
  contentId: string;
  contentType: ContentType;
  textChunk: string;
  score: number;
}
