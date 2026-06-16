import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// ===== PUBLIC ROUTES (No Authentication Required) =====
router.get('/', productController.getPublicProducts);

// ✅ ✅ ✅ YE 2 ROUTES /:productId SE PEHLE HONE CHAHIYE ✅ ✅ ✅
router.get('/all', verifyJWT, authorizeRoles('admin'), productController.getProducts);
router.get('/moderation/pending', verifyJWT, authorizeRoles('admin'), productController.getProductsForModeration);

// ✅ Ab /:productId aayega (LAST)
router.get('/:productId', productController.getPublicProduct);

// ===== PROTECTED ROUTES (Authentication Required) =====
router.use(verifyJWT);

// Moderation action
router.patch('/:productId/moderate', authorizeRoles('admin'), productController.moderateProduct);

// Vendor/Admin routes
router.post('/', authorizeRoles('admin', 'vendor'), productController.createProduct);
router.patch('/:productId', authorizeRoles('admin', 'vendor'), productController.updateProduct);
router.patch('/:productId/status', authorizeRoles('admin', 'vendor'), productController.updateProductStatus);
router.delete('/:productId', authorizeRoles('admin', 'vendor'), productController.deleteProduct);

export default router;