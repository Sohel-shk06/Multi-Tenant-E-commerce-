import { Router } from 'express';
import * as storeController from '../controllers/store.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles('admin', 'vendor'));

router.get('/', storeController.getStores);
router.get('/:storeId', storeController.getStore);
router.post('/', storeController.createStore);
router.patch('/:storeId', storeController.updateStore);
router.delete('/:storeId', storeController.deleteStore);

export default router;