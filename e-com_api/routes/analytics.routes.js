import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All analytics routes are protected and admin-only
router.use(verifyJWT);
router.use(authorizeRoles('admin'));

router.get('/admin/dashboard', analyticsController.getAdminDashboardStats);
router.get('/admin/revenue-chart', analyticsController.getRevenueChartData);
router.get('/admin/dashboard/top-vendors', analyticsController.getTopVendors);

export default router;