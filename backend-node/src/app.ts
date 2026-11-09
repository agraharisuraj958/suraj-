import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import axios from 'axios';
import { logger } from './utils/logger';
import { env } from './config/env';
import { PrismaClient } from '@prisma/client';
import authRoutes from './modules/auth/auth.routes';
import { AppError } from './utils/AppError';
import departmentRoutes from './modules/departments/department.routes';
// Add near your other imports
import appointmentRoutes from './modules/appointments/appointment.routes';
import prescriptionRoutes from './modules/prescriptions/prescription.routes';
import billingRoutes from './modules/billing/billing.routes';
import documentRoutes from './modules/documents/document.routes';


export const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/v1/health/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const aiRes = await axios.get(`${env.AI_SERVICE_URL}/health`, {
      headers: { 'X-API-Key': env.AI_SERVICE_API_KEY },
      timeout: 2000
    });
    res.json({ database: 'ok', aiService: aiRes.data.status });
  } catch (error) {
    res.status(503).json({ status: 'error', details: (error as Error).message });
  }
});

// Mount Auth Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/documents', documentRoutes);
// Global 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message; // Keep details in development mode
  }

  logger.error(err);

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
    },
  });
});

export default app;




