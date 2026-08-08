import { Request, Response } from 'express';
import { KBModel } from '../models/kb.model.js';
import { VectorService } from '../services/vector.service.js';

export class KBController {
  static async createArticle(req: Request, res: Response) {
    try {
      const { title, content_markdown, category_id, is_published } = req.body;

      // 1. Create article record
      const article = await KBModel.createArticle({
        title,
        content_markdown,
        category_id,
        is_published,
      });

      // 2. Perform chunking & 768-dim vector embedding creation
      const chunkCount = await VectorService.indexKBArticle(article.id, content_markdown);

      return res.status(201).json({
        success: true,
        message: 'Knowledge Base article created and indexed successfully',
        data: {
          article,
          indexed_chunks: chunkCount,
          vector_dimensions: 768,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'CreateKBArticleError', message: err.message });
    }
  }

  static async getArticles(req: Request, res: Response) {
    try {
      const articles = await KBModel.findAllArticles();
      return res.json({
        success: true,
        count: articles.length,
        data: articles,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'GetKBArticlesError', message: err.message });
    }
  }

  static async getArticleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const article = await KBModel.findArticleById(id);
      if (!article) {
        return res.status(404).json({ success: false, error: 'NotFound', message: 'Article not found' });
      }
      return res.json({
        success: true,
        data: article,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'GetKBArticleByIdError', message: err.message });
    }
  }
}
