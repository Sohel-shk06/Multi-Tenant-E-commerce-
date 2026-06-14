import { Router } from 'express';
import * as disputeController from '../controllers/dispute.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All dispute routes require authentication
router.use(verifyJWT);

// ===== ADMIN ROUTES =====
router.get('/admin', authorizeRoles('admin'), disputeController.adminGetAllDisputes);
router.get('/admin/analytics', authorizeRoles('admin'), disputeController.adminGetDisputeAnalytics);
router.get('/admin/:disputeId', authorizeRoles('admin'), disputeController.adminGetDisputeById);
router.post('/admin/:disputeId/resolve', authorizeRoles('admin'), disputeController.adminResolveDispute);
router.patch('/admin/:disputeId/status', authorizeRoles('admin'), disputeController.adminUpdateDisputeStatus);

// ===== CUSTOMER ROUTES =====
router.post('/customer', authorizeRoles('customer'), disputeController.customerCreateDispute);
router.get('/customer', authorizeRoles('customer'), disputeController.customerGetDisputes);
router.get('/customer/:disputeId', authorizeRoles('customer'), disputeController.customerGetDisputeById);
router.post('/customer/:disputeId/reply', authorizeRoles('customer'), disputeController.customerReplyToDispute);

// ===== VENDOR ROUTES =====
router.get('/vendor', authorizeRoles('vendor'), disputeController.vendorGetDisputes);
router.get('/vendor/:disputeId', authorizeRoles('vendor'), disputeController.vendorGetDisputeById);
router.post('/vendor/:disputeId/reply', authorizeRoles('vendor'), disputeController.vendorReplyToDispute);

export default router;