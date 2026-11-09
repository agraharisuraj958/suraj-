import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

export const bookAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    datetime: z.string().datetime(), // ISO 8601 string
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AppointmentStatus),
  })
});