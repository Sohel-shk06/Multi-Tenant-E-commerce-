import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/admin/dashboard', analyticsController.getAdminDashboardStats);
router.get('/admin/revenue-chart', analyticsController.getRevenueChartData);
router.get('/admin/dashboard/top-vendors', analyticsController.getTopVendors);

// ✅ NEW: Detailed Analytics Endpoints
router.get('/admin/revenue', analyticsController.getAdminRevenueAnalytics);
router.get('/admin/vendors', analyticsController.getAdminVendorAnalytics);
router.get('/admin/customers', analyticsController.getAdminCustomerAnalytics);
router.get('/admin/sales', analyticsController.getAdminSalesAnalytics);
router.get('/admin/products', analyticsController.getAdminProductAnalytics);
router.get('/admin/orders', analyticsController.getAdminOrderAnalytics);
router.get('/admin/commissions', analyticsController.getAdminCommissionAnalytics);
router.get('/admin/subscriptions', analyticsController.getAdminSubscriptionAnalytics);

export default router;