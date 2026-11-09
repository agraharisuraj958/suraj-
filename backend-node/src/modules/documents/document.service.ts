import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';
import { DocumentKind, DocumentStatus, Role } from '@prisma/client';
import { logger } from '../../utils/logger';

export class DocumentService {
  static async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    data: { title: string; kind: DocumentKind; patientId?: string }
  ) {
    if (data.kind !== DocumentKind.GUIDELINE && !data.patientId) {
      throw new AppError('Patient ID is required for patient records and lab reports', 400);
    }

    // 1. Create DB Record (Status: UPLOADED)
    const document = await prisma.document.create({
      data: {
        title: data.title,
        kind: data.kind,
        patientId: data.patientId,
        url: file.originalname, // In a real app, upload to S3 and store the URL here
        status: DocumentStatus.UPLOADED,
      }
    });

    // 2. Kick off background processing (In-process queue)
    this.processDocumentInAI(document.id, file, data.kind, data.patientId).catch(err => {
      logger.error(`Background ingestion failed for doc ${document.id}:`, err);
    });

    return document;
  }

  private static async processDocumentInAI(
    documentId: string,
    file: Express.Multer.File,
    kind: DocumentKind,
    patientId?: string
  ) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.PROCESSING }
    });

    try {
      // Use native Node FormData to send the multipart file
      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);
      formData.append('documentId', documentId);
      formData.append('kind', kind);
      if (patientId) formData.append('patientId', patientId);

      const response = await fetch(`${env.AI_SERVICE_URL}/api/ingest`, {
        method: 'POST',
        headers: { 'X-API-Key': env.AI_SERVICE_API_KEY },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`AI service returned ${response.status}: ${await response.text()}`);
      }

      await prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.INDEXED }
      });
    } catch (error) {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.FAILED }
      });
      throw error;
    }
  }

  static async getAll(userRole: Role, userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let where = {};

    if (userRole === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where = { 
        OR: [
          { kind: DocumentKind.GUIDELINE }, // Patients can read global guidelines
          { patientId: patient?.id }        // And their own records
        ]
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.document.count({ where })
    ]);

    return { documents, total };
  }

  static async getById(id: string) {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) throw new AppError('Document not found', 404);
    return doc;
  }
}