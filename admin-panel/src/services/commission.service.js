import api from './api';

export const commissionService = {
  getCommissions: async (params) => {
    const response = await api.get('/commissions/admin', { params });
    return response.data.data;
  },

  getCommission: async (commissionId) => {
    const response = await api.get(`/commissions/admin/${commissionId}`);
    return response.data.data;
  },

  updateCommissionStatus: async (commissionId, data) => {
    const response = await api.patch(`/commissions/admin/${commissionId}/status`, data);
    return response.data.data;
  },

  getCommissionAnalytics: async () => {
    const response = await api.get('/commissions/admin/analytics');
    return response.data.data;
  }
};