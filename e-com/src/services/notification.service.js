import api from './api';

/**
 * Fetch notifications for the authenticated customer
 * @returns {Promise<Object>} API Response containing notifications list
 */
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

/**
 * Mark a single notification as read by its ID
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} API Response containing the updated notification
 */
export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};




export const notificationService = {
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data.data;
  },

  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.patch('/notifications/preferences', preferences);
    return response.data.data;
  }
};