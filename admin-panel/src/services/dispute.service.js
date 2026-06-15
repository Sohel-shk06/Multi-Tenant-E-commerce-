import api from './api';

export const disputeService = {
  // Admin: Get all disputes
  getDisputes: async (params) => {
    const response = await api.get('/disputes/admin', { params });
    return response.data.data;
  },

  // Admin: Get single dispute
  getDispute: async (disputeId) => {
    const response = await api.get(`/disputes/admin/${disputeId}`);
    return response.data.data;
  },

  // Admin: Resolve dispute
  resolveDispute: async (disputeId, data) => {
    const response = await api.post(`/disputes/admin/${disputeId}/resolve`, data);
    return response.data.data;
  },

  // Admin: Update dispute status
  updateDisputeStatus: async (disputeId, data) => {
    const response = await api.patch(`/disputes/admin/${disputeId}/status`, data);
    return response.data.data;
  },

  // Admin: Get dispute analytics
  getDisputeAnalytics: async () => {
    const response = await api.get('/disputes/admin/analytics');
    return response.data.data;
  }
};