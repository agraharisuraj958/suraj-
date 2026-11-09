import { Router } from 'express';
import { DepartmentController } from './department.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createDepartmentSchema, updateDepartmentSchema } from './department.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Publicly readable (patients need to see departments to book appointments)
router.get('/', asyncHandler(DepartmentController.getAll));
router.get('/:id', asyncHandler(DepartmentController.getById));

// Admin only operations
router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createDepartmentSchema), asyncHandler(DepartmentController.create));
router.patch('/:id', validate(updateDepartmentSchema), asyncHandler(DepartmentController.update));
router.delete('/:id', asyncHandler(DepartmentController.delete));

export default router;