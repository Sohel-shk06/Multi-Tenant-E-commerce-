import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js'; // ✅ Ye import add karein

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);

// Address routes
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.patch('/addresses/:addressId', userController.updateAddress);
router.delete('/addresses/:addressId', userController.deleteAddress);

// ===== Vendor Settings Routes =====
router.get('/settings', authorizeRoles('vendor'), userController.getVendorSettings);
router.patch('/settings/business', authorizeRoles('vendor'), userController.updateBusinessInfo);
router.patch('/settings/notifications', authorizeRoles('vendor'), userController.updateNotificationPreferences);
router.patch('/settings/bank', authorizeRoles('vendor'), userController.updateBankDetails);
router.delete('/settings/account', authorizeRoles('vendor'), userController.deleteVendorAccount);

export default router;