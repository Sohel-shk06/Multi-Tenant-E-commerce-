import api from './api';

export const analyticsService = {
  // Admin Dashboard Stats fetch karna
  getAdminDashboardStats: async () => {
    const response = await api.get('/analytics/admin/dashboard');
    // 🔥 FIX: response.data.data - ApiResponse wrapper ke andar ka actual stats object
    return response.data.data;
  },

  // Revenue Chart Data fetch karna
  getRevenueChart: async (timeframe = 'monthly') => {
    const response = await api.get(`/analytics/admin/revenue-chart?timeframe=${timeframe}`);
    // 🔥 FIX: response.data.data - ApiResponse wrapper ke andar ka actual array
    return response.data.data;
  }
};