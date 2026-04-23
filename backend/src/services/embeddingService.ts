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

  search: async (query: string, topK = 5): Promise<SearchResult[]> => {
    const queryEmbedding = await embeddingProvider.generateEmbedding(query);
    const allEmbeddings = await embeddingRepository.findAll();

    const scored = allEmbeddings.map((record) => ({
      contentId: record.contentId,
      contentType: record.contentType,
      textChunk: record.textChunk,
      score: cosineSimilarity(queryEmbedding, record.embedding)
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  },

  removeContent: async (contentId: string, contentType: ContentType): Promise<void> => {
    await embeddingRepository.deleteByContent(contentId, contentType);
  }
});
