import { Router } from 'express';
import * as storeController from '../controllers/store.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { uploadStoreImages } from '../middlewares/upload.middleware.js';

const router = Router();

// ===== PUBLIC ROUTES (No Auth Required - Customer ke liye) =====
router.get('/public', storeController.getPublicStores);
router.get('/public/:storeId', storeController.getPublicStore);
router.get('/public/:storeId/products', storeController.getStoreProducts);

// ===== PROTECTED ROUTES (Auth Required - Admin/Vendor ke liye) =====
router.use(verifyJWT);
router.use(authorizeRoles('admin', 'vendor'));

router.get('/', storeController.getStores);
router.get('/:storeId', storeController.getStore);
router.post('/', uploadStoreImages, storeController.createStore);
router.patch('/:storeId', uploadStoreImages, storeController.updateStore);
router.delete('/:storeId', storeController.deleteStore);

// ✅ Store Analytics Route
router.get('/:storeId/analytics', authorizeRoles('admin'), storeController.getStoreAnalytics);

export default router;