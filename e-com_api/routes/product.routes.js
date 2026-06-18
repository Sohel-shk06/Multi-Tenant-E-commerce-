// import { Router } from 'express';
// import * as productController from '../controllers/product.controller.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { authorizeRoles } from '../middlewares/role.middleware.js';
// import { uploadProductImages } from '../middlewares/upload.middleware.js';

// const router = Router();

// // ============================================
// // 🔓 PUBLIC ROUTES (No Authentication Required)
// // ============================================

// // Public product list (home page, search)
// router.get('/', productController.getPublicProducts);

// // ✅ Public single product details (customer product page)
// // YEH ZAROORI HAI - bina login ke customers products dekh sakein
// router.get('/:productId', productController.getPublicProduct);

// // ============================================
// // 🔐 ADMIN SPECIFIC ROUTES (/:productId SE PEHLE!)
// // ============================================

// // Admin product list
// router.get('/all', verifyJWT, authorizeRoles('admin'), productController.getProducts);

// // Admin moderation
// router.get('/moderation/pending', verifyJWT, authorizeRoles('admin'), productController.getProductsForModeration);

// // ✅ Admin fetch ANY product (including draft) for editing
// router.get('/admin/:productId', verifyJWT, authorizeRoles('admin'), productController.getProduct);

// // ============================================
// // 🔐 PROTECTED ROUTES (Authentication Required)
// // ============================================
// router.use(verifyJWT);

// // Admin only - moderate product
// router.patch('/:productId/moderate', authorizeRoles('admin'), productController.moderateProduct);

// // Admin + Vendor - CRUD operations
// router.post(
//   '/',
//   authorizeRoles('admin', 'vendor'),
//   uploadProductImages,
//   productController.createProduct
// );

// router.patch(
//   '/:productId',
//   authorizeRoles('admin', 'vendor'),
//   uploadProductImages,
//   productController.updateProduct
// );

// router.patch('/:productId/status', authorizeRoles('admin', 'vendor'), productController.updateProductStatus);
// router.delete('/:productId', authorizeRoles('admin', 'vendor'), productController.deleteProduct);

// export default router;



import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { uploadProductImages } from '../middlewares/upload.middleware.js';

const router = Router();

// ============================================
// 🔓 PUBLIC ROUTES (No Authentication Required)
// ============================================

// Public product list (home page, search)
router.get('/', productController.getPublicProducts);

// ============================================
// 🔐 ADMIN SPECIFIC ROUTES (/:productId SE PEHLE!)
// ============================================
// ⚠️ IMPORTANT: Yeh routes /:productId SE PEHLE hone chahiye
// Warna "all", "moderation/pending" jaise strings /:productId se match ho jayengi

// Admin product list
router.get('/all', verifyJWT, authorizeRoles('admin'), productController.getProducts);

// Admin moderation
router.get('/moderation/pending', verifyJWT, authorizeRoles('admin'), productController.getProductsForModeration);

// ✅ Admin fetch ANY product (including draft) for editing
router.get('/admin/:productId', verifyJWT, authorizeRoles('admin'), productController.getProduct);

// ============================================
// 🔐 PROTECTED ROUTES (Authentication Required)
// ============================================
router.use(verifyJWT);

// Admin only - moderate product
router.patch('/:productId/moderate', authorizeRoles('admin'), productController.moderateProduct);

// ✅ AB /:productId aayega (LAST mein)
// Public single product details (customer product page)
router.get('/:productId', productController.getPublicProduct);

// Admin + Vendor - CRUD operations
router.post(
  '/',
  authorizeRoles('admin', 'vendor'),
  uploadProductImages,
  productController.createProduct
);

router.patch(
  '/:productId',
  authorizeRoles('admin', 'vendor'),
  uploadProductImages,
  productController.updateProduct
);

router.patch('/:productId/status', authorizeRoles('admin', 'vendor'), productController.updateProductStatus);
router.delete('/:productId', authorizeRoles('admin', 'vendor'), productController.deleteProduct);

export default router;