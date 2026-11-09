import { Request, Response } from 'express';
import { DepartmentService } from './department.service';
import { sendSuccess } from '../../utils/response';

export class DepartmentController {
  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.q as string;

    const { departments, total } = await DepartmentService.getAll(page, limit, search);
    
    sendSuccess(res, departments, { 
      page, 
      limit, 
      total, 
      totalPages: Math.ceil(total / limit) 
    });
  }

  static async getById(req: Request, res: Response) {
    const department = await DepartmentService.getById(req.params.id);
    sendSuccess(res, department);
  }

  static async create(req: Request, res: Response) {
    const department = await DepartmentService.create(req.body);
    sendSuccess(res, department, undefined, 201);
  }

  static async update(req: Request, res: Response) {
    const department = await DepartmentService.update(req.params.id, req.body);
    sendSuccess(res, department);
  }

  static async delete(req: Request, res: Response) {
    await DepartmentService.delete(req.params.id);
    sendSuccess(res, { message: 'Department deleted' });
  }
}