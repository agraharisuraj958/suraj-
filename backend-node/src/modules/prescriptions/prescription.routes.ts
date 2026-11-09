import { Router } from 'express';
import { PrescriptionController } from './prescription.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createPrescriptionSchema } from './prescription.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.get('/', asyncHandler(PrescriptionController.getAll));
router.post('/', authorize('DOCTOR'), validate(createPrescriptionSchema), asyncHandler(PrescriptionController.create));

export default router;