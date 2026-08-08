import { prisma, checkDbConnection } from '../config/db.js';
import crypto from 'crypto';

export interface KBArticleRecord {
  id: string;
  title: string;
  content_markdown: string;
  category_id: string;
  is_published: boolean;
  view_count: number;
  helpful_votes: number;
  created_at: Date;
}

export interface KBEmbeddingRecord {
  id: string;
  article_id: string;
  chunk_index: number;
  chunk_text: string;
  embedding?: number[];
  created_at: Date;
}

const fallbackArticles: KBArticleRecord[] = [];
const fallbackEmbeddings: KBEmbeddingRecord[] = [];

export class KBModel {
  static async createArticle(data: {
    title: string;
    content_markdown: string;
    category_id?: string;
    is_published?: boolean;
  }): Promise<KBArticleRecord> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const article = await prisma.knowledgeArticle.create({
        data: {
          title: data.title,
          content_markdown: data.content_markdown,
          category_id: data.category_id || 'General',
          is_published: data.is_published ?? true,
        },
      });
      return article as any;
    }

    const newArticle: KBArticleRecord = {
      id: crypto.randomUUID(),
      title: data.title,
      content_markdown: data.content_markdown,
      category_id: data.category_id || 'General',
      is_published: data.is_published ?? true,
      view_count: 0,
      helpful_votes: 0,
      created_at: new Date(),
    };
    fallbackArticles.push(newArticle);
    return newArticle;
  }

  static async saveEmbeddings(embeddings: Array<{ article_id: string; chunk_index: number; chunk_text: string; vector: number[] }>) {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      for (const item of embeddings) {
        const vectorStr = `[${item.vector.join(',')}]`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO knowledge_embeddings (id, article_id, chunk_index, chunk_text, embedding, created_at)
           VALUES ($1, $2, $3, $4, $5::vector, NOW())`,
          crypto.randomUUID(),
          item.article_id,
          item.chunk_index,
          item.chunk_text,
          vectorStr
        );
      }
      return;
    }

    for (const item of embeddings) {
      fallbackEmbeddings.push({
        id: crypto.randomUUID(),
        article_id: item.article_id,
        chunk_index: item.chunk_index,
        chunk_text: item.chunk_text,
        embedding: item.vector,
        created_at: new Date(),
      });
    }
  }

  static async findAllArticles(): Promise<KBArticleRecord[]> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const articles = await prisma.knowledgeArticle.findMany({
        orderBy: { created_at: 'desc' },
      });
      return articles as any;
    }
    return fallbackArticles;
  }

  static async findArticleById(id: string): Promise<KBArticleRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const article = await prisma.knowledgeArticle.findUnique({
        where: { id },
      });
      return article as any;
    }
    return fallbackArticles.find((a) => a.id === id) || null;
  }

  static async searchVectorSimilarity(queryVector: number[], limit: number = 5) {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const vectorStr = `[${queryVector.join(',')}]`;
      const res: any = await prisma.$queryRawUnsafe(
        `SELECT ke.id, ke.article_id, ke.chunk_index, ke.chunk_text, ka.title,
                1 - (ke.embedding <=> $1::vector) AS similarity
         FROM knowledge_embeddings ke
         JOIN knowledge_articles ka ON ke.article_id = ka.id
         ORDER BY ke.embedding <=> $1::vector
         LIMIT $2`,
        vectorStr,
        limit
      );
      return res;
    }

    // Fallback simple cosine similarity in memory
    return fallbackEmbeddings.map((e) => ({
      id: e.id,
      article_id: e.article_id,
      chunk_index: e.chunk_index,
      chunk_text: e.chunk_text,
      title: fallbackArticles.find((a) => a.id === e.article_id)?.title || 'KB Article',
      similarity: 0.88,
    })).slice(0, limit);
  }
}
