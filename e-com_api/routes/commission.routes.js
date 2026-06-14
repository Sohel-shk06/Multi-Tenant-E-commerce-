import { Router } from 'express';
import * as commissionController from '../controllers/commission.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All commission routes require authentication
router.use(verifyJWT);

// ===== ADMIN ROUTES =====
router.get('/admin', authorizeRoles('admin'), commissionController.adminGetAllCommissions);
router.get('/admin/analytics', authorizeRoles('admin'), commissionController.adminGetCommissionAnalytics);
router.get('/admin/:commissionId', authorizeRoles('admin'), commissionController.adminGetCommissionById);
router.patch('/admin/:commissionId/status', authorizeRoles('admin'), commissionController.adminUpdateCommissionStatus);

// ===== VENDOR ROUTES =====
router.get('/vendor', authorizeRoles('vendor'), commissionController.vendorGetCommissions);

export default router;