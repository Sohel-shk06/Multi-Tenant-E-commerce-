import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Sabhi product routes ke liye authentication zaroori hai
router.use(verifyJWT);

// Admin aur Vendor dono products dekh sakte hain
router.get('/', 
  authorizeRoles('admin', 'vendor'), 
  productController.getProducts
);

router.get('/:productId', 
  authorizeRoles('admin', 'vendor'), 
  productController.getProduct
);

// ✅ FIX: Admin aur Vendor dono products create kar sakte hain
router.post('/', 
  authorizeRoles('admin', 'vendor'), 
  productController.createProduct
);

router.patch('/:productId', 
  authorizeRoles('admin', 'vendor'), 
  productController.updateProduct
);

router.patch('/:productId/status', 
  authorizeRoles('admin', 'vendor'), 
  productController.updateProductStatus
);

router.delete('/:productId', 
  authorizeRoles('admin', 'vendor'), 
  productController.deleteProduct
);

export default router;