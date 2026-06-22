import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all notification routes with auth middleware
router.use(verifyJWT);

// Fetch logged-in user's notifications
router.get('/', notificationController.getNotifications);

// Create a notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

export default router;
