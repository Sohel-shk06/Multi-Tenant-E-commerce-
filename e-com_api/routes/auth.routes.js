import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail); // ✅ Added
router.post('/resend-verification', authController.resendVerification); // ✅ Added

// Protected Routes
router.get('/me', verifyJWT, authController.getCurrentUser);
router.post('/change-password', verifyJWT, authController.changePassword); // ✅ Added

export default router;