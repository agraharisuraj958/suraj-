import { z } from 'zod';

export const createPrescriptionSchema = z.object({
  body: z.object({
    patientId: z.string().uuid(),
    appointmentId: z.string().uuid().optional(),
    notes: z.string().optional(),
    items: z.array(z.object({
      medication: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string()
    })).min(1)
  })
});