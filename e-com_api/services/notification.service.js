import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Create a new notification
 */
export const createNotification = async (notificationData) => {
  const { userId, title, message, type, link } = notificationData;

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
    link: link || '',
    isRead: false
  });

  return notification;
};

/**
 * Get all notifications for a specific user (existing - customer)
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
 * ✅ NEW: Get vendor notifications with pagination and filtering
 */
export const getVendorNotifications = async (vendorId, query) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = query;
    const skip = (page - 1) * limit;
    
    const filter = { userId: vendorId };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalNotifications = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId: vendorId, isRead: false });

    return {
      notifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: Number(page),
      totalNotifications,
      unreadCount
    };
  } catch (error) {
    console.error('❌ Error in getVendorNotifications:', error);
    throw new ApiError(500, 'Failed to fetch notifications');
  }
};

/**
 * Mark a specific notification as read
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
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

/**
 * ✅ NEW: Mark all notifications as read
 */
export const markAllAsRead = async (vendorId) => {
  try {
    await Notification.updateMany(
      { userId: vendorId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return { success: true };
  } catch (error) {
    console.error('❌ Error in markAllAsRead:', error);
    throw new ApiError(500, 'Failed to mark all as read');
  }
};

/**
 * ✅ NEW: Delete notification
 */
export const deleteNotification = async (notificationId, vendorId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: vendorId
    });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in deleteNotification:', error);
    throw new ApiError(500, 'Failed to delete notification');
  }
};

/**
 * ✅ NEW: Get unread count (for bell icon)
 */
export const getUnreadCount = async (vendorId) => {
  try {
    const count = await Notification.countDocuments({
      userId: vendorId,
      isRead: false
    });
    return { unreadCount: count };
  } catch (error) {
    console.error('❌ Error in getUnreadCount:', error);
    throw new ApiError(500, 'Failed to fetch unread count');
  }
};

// ============================================
// ✅ NEW: Auto-create notifications for vendor events
// ============================================

/**
 * Notify vendor about new order
 */
export const notifyNewOrder = async (vendorId, order) => {
  await createNotification({
    userId: vendorId,
    type: 'order',
    title: '🛒 New Order Received!',
    message: `You have received a new order #${order.orderNumber} worth ₹${order.totalAmount}`,
    link: `/vendor/orders/${order._id}`
  });
};

/**
 * Notify vendor about order status change
 */
export const notifyOrderStatusChange = async (vendorId, order, status) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  };

  await createNotification({
    userId: vendorId,
    type: 'order',
    title: `📦 Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: statusMessages[status] || `Order #${order.orderNumber} status updated to ${status}`,
    link: `/vendor/orders/${order._id}`
  });
};

/**
 * Notify vendor about new review
 */
export const notifyNewReview = async (vendorId, review, product) => {
  await createNotification({
    userId: vendorId,
    type: 'review',
    title: '⭐ New Review Received',
    message: `You received a ${review.rating}-star review on "${product.title}"`,
    link: `/vendor/reviews/${review._id}`
  });
};

/**
 * Notify vendor about payment received
 */
export const notifyPaymentReceived = async (vendorId, payment) => {
  await createNotification({
    userId: vendorId,
    type: 'payment',
    title: '💰 Payment Received',
    message: `Payment of ₹${payment.amount} has been received`,
    link: `/vendor/earnings`
  });
};

/**
 * Notify vendor about low stock
 */
export const notifyLowStock = async (vendorId, product) => {
  await createNotification({
    userId: vendorId,
    type: 'product',
    title: '⚠️ Low Stock Alert',
    message: `Product "${product.title}" has only ${product.stock} items left`,
    link: `/vendor/products/edit/${product._id}`
  });
};