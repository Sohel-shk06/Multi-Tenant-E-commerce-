import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// ✅ FIX: GET routes ko admin, vendor, aur customer sab ke liye open karein
router.get('/', verifyJWT, authorizeRoles('admin', 'vendor', 'customer'), categoryController.getCategories);
router.get('/:categoryId', verifyJWT, authorizeRoles('admin', 'vendor', 'customer'), categoryController.getCategory);

// ✅ POST, PATCH, DELETE sirf admin ke liye restricted rahenge
router.post('/', verifyJWT, authorizeRoles('admin'), categoryController.createCategory);
router.patch('/:categoryId', verifyJWT, authorizeRoles('admin'), categoryController.updateCategory);
router.delete('/:categoryId', verifyJWT, authorizeRoles('admin'), categoryController.deleteCategory);

export default router;