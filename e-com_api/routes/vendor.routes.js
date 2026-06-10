import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All vendor routes are protected and admin-only
router.use(verifyJWT);
router.use(authorizeRoles('admin'));

router.get('/', vendorController.getVendors);
router.post('/', vendorController.createVendor);
router.patch('/:vendorId/status', vendorController.updateVendorStatus);

export default router;