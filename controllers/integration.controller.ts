import { Request, Response } from 'express';
import { IntegrationService } from '../services/integration.service.js';

export class IntegrationController {
  static async handleWebhook(req: Request, res: Response) {
    try {
      const { event, payload } = req.body;
      const result = await IntegrationService.handleWebhook(event, payload);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'WebhookProcessingError', message: err.message });
    }
  }

  static async oktaPasswordReset(req: Request, res: Response) {
    try {
      const { email, okta_id } = req.body;
      const result = await IntegrationService.triggerOktaPasswordReset(email, okta_id);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'OktaResetError', message: err.message });
    }
  }
}
