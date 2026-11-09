import { Request, Response } from 'express';
import { DocumentService } from './document.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/AppError';
import { DocumentKind } from '@prisma/client';

export class DocumentController {
  static async upload(req: Request, res: Response) {
    if (!req.file) throw new AppError('No file uploaded', 400);

    const { title, kind, patientId } = req.body;
    
    if (!title || !kind || !Object.values(DocumentKind).includes(kind)) {
      throw new AppError('Invalid title or document kind', 400);
    }

    const document = await DocumentService.uploadDocument(req.user!.userId, req.file, {
      title, kind, patientId
    });

    sendSuccess(res, document, undefined, 202); // 202 Accepted (processing in background)
  }

  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { documents, total } = await DocumentService.getAll(req.user!.role, req.user!.userId, page, limit);
    sendSuccess(res, documents, { page, limit, total, totalPages: Math.ceil(total / limit) });
  }

  static async getById(req: Request, res: Response) {
    const document = await DocumentService.getById(req.params.id);
    sendSuccess(res, document);
  }
}