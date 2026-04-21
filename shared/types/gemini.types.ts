import { Post } from './post.types';

export interface Embedding {
  _id?: string;
  postId: string;
  vector: number[];
  textChunk: string;
  createdAt?: string;
}

export interface SearchQuery {
  query: string;
  limit?: number;
}

export interface SearchResult {
  post: Post;
  score: number;
  matchChunk?: string;
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  augmentedPrompt: string;
}

export interface RAGResponse {
  answer: string;
  contextUsed: SearchResult[];
}
