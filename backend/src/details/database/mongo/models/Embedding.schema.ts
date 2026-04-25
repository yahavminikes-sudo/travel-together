import mongoose, { Document, Schema } from 'mongoose';
import { ContentType } from '@travel-together/shared/types/search.types';

export interface IEmbeddingDocument extends Document {
  contentId: string;
  contentType: ContentType;
  textChunk: string;
  embedding: number[];
  createdAt: string;
  updatedAt: string;
}

const embeddingSchema = new Schema<IEmbeddingDocument>(
  {
    contentId: { type: String, required: true, index: true },
    contentType: { type: String, required: true, enum: ['Post', 'Comment'] },
    textChunk: { type: String, required: true },
    embedding: { type: [Number], required: true }
  },
  { timestamps: true }
);

embeddingSchema.index({ contentId: 1, contentType: 1 });

export const EmbeddingModel = mongoose.model<IEmbeddingDocument>('Embedding', embeddingSchema);
