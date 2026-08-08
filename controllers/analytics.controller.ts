import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  static async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await AnalyticsService.getRealtimeMetrics();
      return res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'AnalyticsMetricsError', message: err.message });
    }
  }
}
