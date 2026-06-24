import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Create a new notification
 * @param {Object} notificationData - The data for the notification
 * @param {string} notificationData.userId - ID of the user the notification is for
 * @param {string} notificationData.title - Heading of the notification
 * @param {string} notificationData.message - Body text of the notification
 * @param {string} [notificationData.type] - Type of notification ('order_update', 'promo', 'security')
 * @returns {Promise<Object>} The created notification
 */
export const createNotification = async (notificationData) => {
  const { userId, title, message, type } = notificationData;

  if (!userId) {
    throw new ApiError(400, 'User ID is required to create a notification');
  }
  if (!title) {
    throw new ApiError(400, 'Notification title is required');
  }
  if (!message) {
    throw new ApiError(400, 'Notification message is required');
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
    type: type || 'order_update',
    isRead: false
  });

  return notification;
};

/**
 * Get all notifications for a specific user, sorted newest first
 * @param {string} userId - ID of the logged-in user
 * @returns {Promise<Array>} List of notifications
 */
export const getUserNotifications = async (userId) => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required to fetch notifications');
  }

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 });

  return notifications;
};

/**
 * Mark a specific notification as read, with ownership verification
 * @param {string} notificationId - ID of the notification to update
 * @param {string} userId - ID of the user trying to perform the update
 * @returns {Promise<Object>} The updated notification
 */
export const markAsRead = async (notificationId, userId) => {
  if (!notificationId) {
    throw new ApiError(400, 'Notification ID is required');
  }
  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  // Security ownership check
  if (notification.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to access this notification');
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};
