import { GoogleGenerativeAI } from '@google/generative-ai';
import { appConfig } from '../../config/appConfig';
import { IEmbeddingProvider } from '../../entities/IEmbeddingProvider';

export const createGeminiEmbeddingProvider = (): IEmbeddingProvider => {
  const genAI = new GoogleGenerativeAI(appConfig.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });

  return {
    generateEmbedding: async (text: string): Promise<number[]> => {
      const result = await model.embedContent(text);
      return result.embedding.values;
    }
  };
};
