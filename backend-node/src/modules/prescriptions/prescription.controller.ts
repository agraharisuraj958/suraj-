import { Request, Response } from 'express';
import { PrescriptionService } from './prescription.service';
import { sendSuccess } from '../../utils/response';

export class PrescriptionController {
  static async create(req: Request, res: Response) {
    const prescription = await PrescriptionService.create(req.user!.userId, req.body);
    sendSuccess(res, prescription, undefined, 201);
  }

  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { prescriptions, total } = await PrescriptionService.getAll(
      req.user!.role,
      req.user!.userId,
      page,
      limit
    );
    
    sendSuccess(res, prescriptions, { page, limit, total, totalPages: Math.ceil(total / limit) });
  }
}