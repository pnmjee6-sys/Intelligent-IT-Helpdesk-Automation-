import { GeminiService } from './gemini.service.js';
import { KBModel } from '../models/kb.model.js';

export class VectorService {
  /**
   * Chunks markdown content into ~500 character chunks with 50 character overlap
   */
  static chunkContent(markdown: string, chunkSize: number = 500, overlap: number = 50): string[] {
    const cleanText = markdown.trim();
    if (cleanText.length <= chunkSize) {
      return [cleanText];
    }

    const chunks: string[] = [];
    let start = 0;
    while (start < cleanText.length) {
      const end = Math.min(start + chunkSize, cleanText.length);
      chunks.push(cleanText.substring(start, end));
      if (end === cleanText.length) break;
      start += chunkSize - overlap;
    }
    return chunks;
  }

  /**
   * Processes a new KB article: chunks content, generates 768-dim embeddings via Gemini, saves to pgvector table.
   */
  static async indexKBArticle(articleId: string, markdownContent: string) {
    const chunks = this.chunkContent(markdownContent);
    const records = [];

    for (let index = 0; index < chunks.length; index++) {
      const chunkText = chunks[index];
      const vector = await GeminiService.generateEmbedding(chunkText);
      records.push({
        article_id: articleId,
        chunk_index: index,
        chunk_text: chunkText,
        vector,
      });
    }

    await KBModel.saveEmbeddings(records);
    return records.length;
  }

  /**
   * Hybrid RAG query vector search using cosine similarity
   */
  static async searchVector(query: string, limit: number = 5) {
    const queryVector = await GeminiService.generateEmbedding(query);
    return await KBModel.searchVectorSimilarity(queryVector, limit);
  }
}
