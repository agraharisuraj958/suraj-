import { Router } from 'express';
import { BillingController } from './billing.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { updateInvoiceStatusSchema } from './billing.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.get('/invoices', asyncHandler(BillingController.getInvoices));
router.patch('/invoices/:id/status', authorize('ADMIN', 'RECEPTIONIST'), validate(updateInvoiceStatusSchema), asyncHandler(BillingController.updateStatus));
router.get('/stats', authorize('ADMIN'), asyncHandler(BillingController.getStats));

export default router;