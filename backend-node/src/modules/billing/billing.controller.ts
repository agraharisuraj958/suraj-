import { Request, Response } from 'express';
import { BillingService } from './billing.service';
import { sendSuccess } from '../../utils/response';

export class BillingController {
  static async getInvoices(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { invoices, total } = await BillingService.getInvoices(req.user!.role, req.user!.userId, page, limit);
    sendSuccess(res, invoices, { page, limit, total, totalPages: Math.ceil(total / limit) });
  }

  static async updateStatus(req: Request, res: Response) {
    const invoice = await BillingService.updateInvoiceStatus(req.params.id, req.body.status);
    sendSuccess(res, invoice);
  }

  static async getStats(req: Request, res: Response) {
    const stats = await BillingService.getAdminStats();
    sendSuccess(res, stats);
  }
}