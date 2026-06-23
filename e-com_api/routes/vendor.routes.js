import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { uploadProductImages } from '../middlewares/upload.middleware.js';

const router = Router();
router.use(verifyJWT);

// ===== VENDOR DASHBOARD ROUTES =====
router.get('/dashboard/stats', authorizeRoles('vendor', 'admin'), vendorController.getVendorStats);
router.get('/dashboard/revenue-chart', authorizeRoles('vendor', 'admin'), vendorController.getVendorRevenueChart);
router.get('/dashboard/recent-orders', authorizeRoles('vendor', 'admin'), vendorController.getVendorRecentOrders);

// ===== VENDOR STORE ROUTES (Specific paths PEHLE) =====
router.get('/stores', authorizeRoles('vendor', 'admin'), vendorController.getVendorStores);
router.get('/stores/list', authorizeRoles('vendor', 'admin'), vendorController.getVendorStoresList);
router.post('/stores', authorizeRoles('vendor'), vendorController.createVendorStore);
router.get('/stores/:storeId', authorizeRoles('vendor', 'admin'), vendorController.getVendorStore);
router.patch('/stores/:storeId', authorizeRoles('vendor'), vendorController.updateVendorStore);
router.delete('/stores/:storeId', authorizeRoles('vendor'), vendorController.deleteVendorStore);

// ===== VENDOR PRODUCT ROUTES (Specific paths PEHLE) =====
router.get('/products', authorizeRoles('vendor', 'admin'), vendorController.getVendorProducts);
router.post('/products', authorizeRoles('vendor'), uploadProductImages, vendorController.createVendorProduct);
router.get('/products/:productId', authorizeRoles('vendor', 'admin'), vendorController.getVendorProduct);
router.patch('/products/:productId', authorizeRoles('vendor'), uploadProductImages, vendorController.updateVendorProduct);
router.delete('/products/:productId', authorizeRoles('vendor'), vendorController.deleteVendorProduct);

// ===== ADMIN VENDOR MANAGEMENT ROUTES =====
router.get('/', authorizeRoles('admin'), vendorController.getVendors);
router.post('/', authorizeRoles('admin'), vendorController.createVendor);
router.get('/:vendorId', authorizeRoles('admin'), vendorController.getVendorById);
router.patch('/:vendorId/status', authorizeRoles('admin'), vendorController.updateVendorStatus);

// ===== VENDOR ORDER ROUTES =====
router.get('/orders', authorizeRoles('vendor', 'admin'), vendorController.getVendorOrders);
router.patch('/orders/:orderId/status', authorizeRoles('vendor'), vendorController.updateVendorOrderStatus);
router.get('/orders/:orderId', authorizeRoles('vendor', 'admin'), vendorController.getVendorOrder);

// ===== VENDOR EARNINGS ROUTES (Specific paths PEHLE) =====
router.get('/earnings/overview', authorizeRoles('vendor', 'admin'), vendorController.getVendorEarningsOverview);
router.get('/earnings/payouts', authorizeRoles('vendor', 'admin'), vendorController.getVendorPayoutHistory);
router.post('/earnings/payouts', authorizeRoles('vendor'), vendorController.requestVendorPayout);
router.get('/earnings/monthly', authorizeRoles('vendor', 'admin'), vendorController.getVendorMonthlyEarnings);

// ===== VENDOR REVIEW ROUTES (Specific paths PEHLE) =====
router.get('/reviews', authorizeRoles('vendor', 'admin'), vendorController.getVendorReviews);
router.get('/reviews/analytics', authorizeRoles('vendor', 'admin'), vendorController.getVendorReviewAnalytics);
router.get('/reviews/:reviewId', authorizeRoles('vendor', 'admin'), vendorController.getVendorReview);
router.post('/reviews/:reviewId/reply', authorizeRoles('vendor'), vendorController.replyToReview);
router.delete('/reviews/:reviewId/reply', authorizeRoles('vendor'), vendorController.deleteVendorReply);

// ===== VENDOR ANALYTICS ROUTES (Specific paths PEHLE) =====
router.get('/analytics/revenue', authorizeRoles('vendor', 'admin'), vendorController.getVendorRevenueAnalytics);
router.get('/analytics/products', authorizeRoles('vendor', 'admin'), vendorController.getVendorProductAnalytics);
router.get('/analytics/orders', authorizeRoles('vendor', 'admin'), vendorController.getVendorOrderAnalytics);
router.get('/analytics/customers', authorizeRoles('vendor', 'admin'), vendorController.getVendorCustomerAnalytics);
router.get('/analytics/sales', authorizeRoles('vendor', 'admin'), vendorController.getVendorSalesAnalytics);

// ===== ADMIN VENDOR MANAGEMENT ROUTES (LAST mein) =====
router.get('/', authorizeRoles('admin'), vendorController.getVendors);
router.post('/', authorizeRoles('admin'), vendorController.createVendor);
router.patch('/:vendorId/status', authorizeRoles('admin'), vendorController.updateVendorStatus);
router.get('/:vendorId', authorizeRoles('admin'), vendorController.getVendorById);  // ← AB LAST MEIN HAI!

export default router;