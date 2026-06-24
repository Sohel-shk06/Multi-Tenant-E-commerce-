import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all notification routes with auth middleware
router.use(verifyJWT);

// ===== CUSTOMER ROUTES (Existing) =====
router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id/read', notificationController.markAsRead);

// ===== VENDOR ROUTES (NEW) =====
// ✅ Get vendor notifications with pagination
router.get('/vendor', notificationController.getVendorNotifications);

// ✅ Get unread count (for bell icon)
router.get('/unread-count', notificationController.getUnreadCount);

// ✅ Mark all as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// ✅ Delete notification
router.delete('/:id', notificationController.deleteNotification);

export default router;