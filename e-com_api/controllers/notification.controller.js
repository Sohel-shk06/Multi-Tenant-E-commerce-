import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as notificationService from '../services/notification.service.js';

/**
 * Fetch all notifications for the authenticated user, sorted newest first
 * GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, notifications, 'Notifications fetched successfully')
  );
});

/**
 * Create a new notification
 * POST /api/notifications
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type } = req.body;
  const notification = await notificationService.createNotification({
    userId,
    title,
    message,
    type
  });
  return res.status(201).json(
    new ApiResponse(201, notification, 'Notification created successfully')
  );
});

/**
 * Mark a notification as read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return res.status(200).json(
    new ApiResponse(200, notification, 'Notification marked as read successfully')
  );
});
