import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All category routes are protected and admin-only
router.use(verifyJWT);
router.use(authorizeRoles('admin'));

router.get('/', categoryController.getCategories);
router.get('/:categoryId', categoryController.getCategory);
router.post('/', categoryController.createCategory);
router.patch('/:categoryId', categoryController.updateCategory);
router.delete('/:categoryId', categoryController.deleteCategory);

export default router;