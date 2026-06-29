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
  
 // ✅ UPDATED: Create store with FormData support
createStore: async (storeData) => {
  const isFormData = storeData instanceof FormData;
  const response = await api.post('/stores', storeData, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  });
  return response.data.data;
},

// ✅ UPDATED: Update store with FormData support
updateStore: async (storeId, storeData) => {
  const isFormData = storeData instanceof FormData;
  const response = await api.patch(`/stores/${storeId}`, storeData, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  });
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