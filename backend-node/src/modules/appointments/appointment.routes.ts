import { Router } from 'express';
import { AppointmentController } from './appointment.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { bookAppointmentSchema, updateStatusSchema } from './appointment.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

// Patients book appointments
router.post('/', authorize('PATIENT'), validate(bookAppointmentSchema), asyncHandler(AppointmentController.book));

// Everyone can view their scoped appointments
router.get('/', asyncHandler(AppointmentController.getAll));

// Staff update statuses
router.patch('/:id/status', authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), validate(updateStatusSchema), asyncHandler(AppointmentController.updateStatus));

export default router;