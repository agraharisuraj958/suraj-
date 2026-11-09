import { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export const sendSuccess = (res: Response, data: any, meta?: Meta, statusCode = 200) => {
  res.status(statusCode).json({
    data,
    meta,
  });
};