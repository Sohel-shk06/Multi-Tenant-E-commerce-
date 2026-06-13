import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// ===== PUBLIC ROUTES (No Authentication Required) =====
router.get('/', productController.getPublicProducts);
router.get('/:productId', productController.getPublicProduct);

// ===== PROTECTED ROUTES (Authentication Required) =====
router.use(verifyJWT);

// Moderation routes (Admin only)
router.get('/moderation/pending', authorizeRoles('admin'), productController.getProductsForModeration);
router.patch('/:productId/moderate', authorizeRoles('admin'), productController.moderateProduct);

// Vendor/Admin routes
router.post('/', authorizeRoles('admin', 'vendor'), productController.createProduct);
router.patch('/:productId', authorizeRoles('admin', 'vendor'), productController.updateProduct);
router.patch('/:productId/status', authorizeRoles('admin', 'vendor'), productController.updateProductStatus);
router.delete('/:productId', authorizeRoles('admin', 'vendor'), productController.deleteProduct);

export default router;