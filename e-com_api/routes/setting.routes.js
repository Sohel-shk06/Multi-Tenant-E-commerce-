import { Router } from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles('admin'));

// Get all settings
router.get('/', settingController.getAllSettings);

// Get settings by category
router.get('/:category', settingController.getSettingsByCategory);

// Update settings by category
router.patch('/:category', settingController.updateSettings);

export default router;