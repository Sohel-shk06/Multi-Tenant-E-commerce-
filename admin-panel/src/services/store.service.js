import api from './api';

export const storeService = {
  getStores: async (params) => {
    const response = await api.get('/stores', { params });
    return response.data.data;
  },
  
  // ✅ NEW: Get single store
  getStore: async (storeId) => {
    const response = await api.get(`/stores/${storeId}`);
    return response.data.data;
  },
  
  createStore: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data.data;
  },
  
  updateStore: async (storeId, storeData) => {
    const response = await api.patch(`/stores/${storeId}`, storeData);
    return response.data.data;
  },
  
  deleteStore: async (storeId) => {
    const response = await api.delete(`/stores/${storeId}`);
    return response.data.data;
  },
  
  // ✅ NEW: Store analytics
  getStoreAnalytics: async (storeId) => {
    const response = await api.get(`/stores/${storeId}/analytics`);
    return response.data.data;
  },
  
  // ✅ NEW: Store settings
  getStoreSettings: async (storeId) => {
    const response = await api.get(`/stores/${storeId}/settings`);
    return response.data.data;
  },
  
  updateStoreSettings: async (storeId, settings) => {
    const response = await api.patch(`/stores/${storeId}/settings`, settings);
    return response.data.data;
  }
};