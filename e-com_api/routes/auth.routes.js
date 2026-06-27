import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public Routes
router.post('/register', authController.register);
router.post('/verify-registration-otp', authController.verifyRegistrationOtp); // ✅ NEW
router.post('/resend-registration-otp', authController.resendRegistrationOtp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword); // ✅ Updated
router.post('/verify-reset-otp', authController.verifyResetOtp); // ✅ NEW
router.post('/reset-password-with-otp', authController.resetPasswordWithOtp); // ✅ NEW
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail); // ✅ Added
router.post('/resend-verification', authController.resendVerification); // ✅ Added

router.post('/request-email-change', verifyJWT, authController.requestEmailChange);
router.post('/verify-email-change', verifyJWT, authController.verifyEmailChange);

// Protected Routes
router.get('/me', verifyJWT, authController.getCurrentUser);
router.post('/change-password', verifyJWT, authController.changePassword); // ✅ Added

export default router;