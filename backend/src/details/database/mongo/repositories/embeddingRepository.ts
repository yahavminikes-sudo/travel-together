import { EmbeddingRecord, IEmbeddingRepository } from '../../../../entities/IRepositories';
import { EmbeddingModel } from '../models/Embedding.schema';
import { ContentType } from '@shared/search.types';

export const createEmbeddingRepository = (): IEmbeddingRepository => ({
  save: async (record: Omit<EmbeddingRecord, '_id'>): Promise<EmbeddingRecord> => {
    const doc = await EmbeddingModel.create(record);
    return {
      _id: doc._id.toString(),
      contentId: doc.contentId,
      contentType: doc.contentType,
      textChunk: doc.textChunk,
      embedding: doc.embedding
    };
  },

  findAll: async (): Promise<EmbeddingRecord[]> => {
    const docs = await EmbeddingModel.find().exec();
    return docs.map((doc) => ({
      _id: doc._id.toString(),
      contentId: doc.contentId,
      contentType: doc.contentType,
      textChunk: doc.textChunk,
      embedding: doc.embedding
    }));
  },

  deleteByContent: async (contentId: string, contentType: ContentType): Promise<boolean> => {
    const result = await EmbeddingModel.deleteMany({ contentId, contentType }).exec();
    return (result.deletedCount ?? 0) > 0;
  }
});
