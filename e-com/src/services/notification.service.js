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
