import api from './api';

export const analyticsService = {
  // Admin Dashboard Stats fetch karna
  getAdminDashboardStats: async () => {
    const response = await api.get('/analytics/admin/dashboard');
    return response.data.data;
  },

  // Revenue Chart Data fetch karna
  getRevenueChart: async (timeframe = 'monthly') => {
    const response = await api.get(`/analytics/admin/revenue-chart?timeframe=${timeframe}`);
    return response.data.data;
  },

  // ✅ NEW: Top Vendors fetch karna
  getTopVendors: async (limit = 5) => {
    const response = await api.get(`/analytics/admin/dashboard/top-vendors?limit=${limit}`);
    return response.data.data;
  }
};