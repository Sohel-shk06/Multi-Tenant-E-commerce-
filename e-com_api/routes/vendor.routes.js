import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

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

// ===== VENDOR PRODUCT ROUTES =====
router.get('/products', authorizeRoles('vendor', 'admin'), vendorController.getVendorProducts);
router.post('/products', authorizeRoles('vendor'), vendorController.createVendorProduct);
router.get('/products/:productId', authorizeRoles('vendor', 'admin'), vendorController.getVendorProduct);
router.patch('/products/:productId', authorizeRoles('vendor'), vendorController.updateVendorProduct);
router.delete('/products/:productId', authorizeRoles('vendor'), vendorController.deleteVendorProduct);

// ===== ADMIN VENDOR MANAGEMENT ROUTES =====
router.get('/', authorizeRoles('admin'), vendorController.getVendors);
router.post('/', authorizeRoles('admin'), vendorController.createVendor);
router.patch('/:vendorId/status', authorizeRoles('admin'), vendorController.updateVendorStatus);

// ===== VENDOR ORDER ROUTES =====
router.get('/orders', authorizeRoles('vendor', 'admin'), vendorController.getVendorOrders);
router.patch('/orders/:orderId/status', authorizeRoles('vendor'), vendorController.updateVendorOrderStatus);
router.get('/orders/:orderId', authorizeRoles('vendor', 'admin'), vendorController.getVendorOrder);

export default router;