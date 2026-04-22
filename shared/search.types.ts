export enum ContentType {
  Post = 'Post',
  Comment = 'Comment'
}

export interface SearchResult {
  contentId: string;
  contentType: ContentType;
  textChunk: string;
  score: number;
}
