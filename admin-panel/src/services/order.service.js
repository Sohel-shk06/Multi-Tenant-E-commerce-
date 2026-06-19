import api from './api';

export const orderService = {
  getOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  }
};