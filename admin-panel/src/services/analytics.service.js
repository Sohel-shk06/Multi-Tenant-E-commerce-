import api from './api';

export const analyticsService = {
  getAdminDashboardStats: async () => {
    const response = await api.get('/analytics/admin/dashboard');
    return response.data.data;
  },

  getRevenueChart: async (timeframe = 'monthly') => {
    const response = await api.get(`/analytics/admin/revenue-chart?timeframe=${timeframe}`);
    return response.data.data;
  },

  getTopVendors: async (limit = 5) => {
    const response = await api.get(`/analytics/admin/dashboard/top-vendors?limit=${limit}`);
    return response.data.data;
  },

  // ✅ NEW: Detailed analytics
  getRevenueAnalytics: async (params) => {
    const response = await api.get('/analytics/admin/revenue', { params });
    return response.data.data;
  },

  getVendorAnalytics: async () => {
    const response = await api.get('/analytics/admin/vendors');
    return response.data.data;
  },

  getCustomerAnalytics: async () => {
    const response = await api.get('/analytics/admin/customers');
    return response.data.data;
  },

  getSalesAnalytics: async () => {
    const response = await api.get('/analytics/admin/sales');
    return response.data.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get('/analytics/admin/products');
    return response.data.data;
  },

  getOrderAnalytics: async () => {
    const response = await api.get('/analytics/admin/orders');
    return response.data.data;
  },

  getCommissionAnalytics: async () => {
    const response = await api.get('/analytics/admin/commissions');
    return response.data.data;
  },

  getSubscriptionAnalytics: async () => {
    const response = await api.get('/analytics/admin/subscriptions');
    return response.data.data;
  }
};