/**
 * Splits a text into smaller chunks for embedding.
 * Each chunk will be at most `maxChunkSize` characters,
 * splitting on sentence boundaries where possible.
 */
export const chunkText = (text: string, maxChunkSize = 500): string[] => {
  if (!text || text.length === 0) return [];
  if (text.length <= maxChunkSize) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
