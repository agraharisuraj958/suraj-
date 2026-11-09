import { Router } from 'express';
import multer from 'multer';
import { DocumentController } from './document.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

// Configure multer for memory storage with a 10MB limit and PDF/Image filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only PDFs and images are allowed', 400) as any, false);
    }
  }
});

const router = Router();

router.use(authenticate);

// List and poll document status
router.get('/', asyncHandler(DocumentController.getAll));
router.get('/:id', asyncHandler(DocumentController.getById));

// Staff upload endpoint
router.post(
  '/', 
  authorize('ADMIN', 'DOCTOR'), 
  upload.single('file'), 
  asyncHandler(DocumentController.upload)
);

export default router;