import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All payment routes require authentication
router.use(verifyJWT);

// ===== ✅ ADMIN ROUTES - MUST BE BEFORE /:paymentId ✅ =====
router.get('/admin/transactions', authorizeRoles('admin'), paymentController.adminGetAllTransactions);
router.get('/admin/payouts', authorizeRoles('admin'), paymentController.adminGetAllPayouts);
router.get('/admin/analytics', authorizeRoles('admin'), paymentController.adminGetPaymentAnalytics);
router.patch('/admin/payouts/:payoutId', authorizeRoles('admin'), paymentController.adminUpdatePayoutStatus);
router.get('/admin/transactions/:paymentId', authorizeRoles('admin'), paymentController.adminGetTransactionById);



export default router;