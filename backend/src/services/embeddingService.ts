import { IEmbeddingProvider } from '../entities/IEmbeddingProvider';
import { IEmbeddingRepository } from '../entities/IRepositories';
import { IEmbeddingService } from '../entities/IServices';
import { ContentType, SearchResult } from '@travel-together/shared/types/search.types';
import { chunkText } from '../utils/chunkText';
import { cosineSimilarity } from '../utils/cosineSimilarity';

interface EmbeddingServiceDependencies {
  embeddingRepository: IEmbeddingRepository;
  embeddingProvider: IEmbeddingProvider;
}

export const createEmbeddingService = ({
  embeddingRepository,
  embeddingProvider
}: EmbeddingServiceDependencies): IEmbeddingService => ({
  indexContent: async (contentId: string, contentType: ContentType, text: string): Promise<void> => {
    await embeddingRepository.deleteByContent(contentId, contentType);

    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await embeddingProvider.generateEmbedding(chunk);
      await embeddingRepository.save({
        contentId,
        contentType,
        textChunk: chunk,
        embedding
      });
    }
  },

  search: async (query: string): Promise<SearchResult[]> => {
    const queryEmbedding = await embeddingProvider.generateEmbedding(query);
    const allEmbeddings = await embeddingRepository.findAll();

    const threshold = 0.55;

    const scored = allEmbeddings
      .map((record) => ({
        contentId: record.contentId,
        contentType: record.contentType,
        textChunk: record.textChunk,
        score: cosineSimilarity(queryEmbedding, record.embedding)
      }))
      .filter((result) => result.score >= threshold);

    const uniqueResults = scored.reduce((acc, current) => {
      const existing = acc.find((r) => r.contentId === current.contentId);
      if (!existing) {
        acc.push(current);
      } else if (current.score > existing.score) {
        Object.assign(existing, current);
      }
      return acc;
    }, [] as SearchResult[]);

    uniqueResults.sort((a, b) => b.score - a.score);

    return uniqueResults;
  },

  removeContent: async (contentId: string, contentType: ContentType): Promise<void> => {
    await embeddingRepository.deleteByContent(contentId, contentType);
  }
});
