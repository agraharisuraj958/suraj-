import { Request, Response } from 'express';
import { AppointmentService } from './appointment.service';
import { sendSuccess } from '../../utils/response';

export class AppointmentController {
  static async book(req: Request, res: Response) {
    const { doctorId, datetime } = req.body;
    const appointment = await AppointmentService.book(req.user!.userId, doctorId, datetime);
    sendSuccess(res, appointment, undefined, 201);
  }

  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { appointments, total } = await AppointmentService.getAll(
      req.user!.role,
      req.user!.userId,
      page,
      limit
    );
    
    sendSuccess(res, appointments, { page, limit, total, totalPages: Math.ceil(total / limit) });
  }

  static async updateStatus(req: Request, res: Response) {
    const appointment = await AppointmentService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, appointment);
  }
}