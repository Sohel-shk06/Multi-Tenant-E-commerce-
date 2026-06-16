import api from './api';

export const paymentService = {
  getTransactions: async (params) => {
    const response = await api.get('/payment/admin/transactions', { params });
    return response.data.data;
  },

  getTransaction: async (paymentId) => {
    const response = await api.get(`/payment/admin/transactions/${paymentId}`);
    return response.data.data;
  },

  getPayouts: async (params) => {
    const response = await api.get('/payment/admin/payouts', { params });
    return response.data.data;
  },

  updatePayoutStatus: async (payoutId, data) => {
    const response = await api.patch(`/payment/admin/payouts/${payoutId}`, data);
    return response.data.data;
  },

  getPaymentAnalytics: async () => {
    const response = await api.get('/payment/admin/analytics');
    return response.data.data;
  }
};