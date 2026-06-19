import api from './api';

export const storeService = {
  // Public endpoints (no auth required)
  getPublicStores: async (params) => {
    const response = await api.get('/stores/public', { params });
    return response.data.data;
  },

  getPublicStore: async (storeId) => {
    const response = await api.get(`/stores/public/${storeId}`);
    return response.data.data;
  },

  getStoreProducts: async (storeId, params) => {
    const response = await api.get(`/stores/public/${storeId}/products`, { params });
    return response.data.data;
  }
};