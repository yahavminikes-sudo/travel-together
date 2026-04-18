import { Post } from './post.types';

export interface Embedding {
  _id?: string;
  postId: string;
  vector: number[]; // Vector representation of the text
  textChunk: string; // Original text chunk that was embedded
  createdAt?: string;
}

export interface SearchQuery {
  query: string;
  limit?: number;
}

export interface SearchResult {
  post: Post;
  score: number; // Similarity score (e.g., cosine similarity)
  matchChunk?: string; // The specific text chunk that matched
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  augmentedPrompt: string; // The prompt enriched with context from the search results
}

export interface RAGResponse {
  answer: string; // AI generated answer
  contextUsed: SearchResult[]; // The context that was used to generate the answer
}
