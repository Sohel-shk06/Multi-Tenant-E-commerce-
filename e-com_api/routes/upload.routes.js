import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware
router.use(verifyJWT);

// Handle single or multiple image uploads (max 5)
router.post('/', upload.array('images', 5), uploadImages);

export default router;
