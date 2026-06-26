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
    const formData = new FormData();
    formData.append('name', storeData.name);
    formData.append('description', storeData.description || '');
    if (storeData.vendor) formData.append('vendor', storeData.vendor);
    if (storeData.status) formData.append('status', storeData.status);
    if (storeData.settings) {
      formData.append('settings', JSON.stringify(storeData.settings));
    }
    if (storeData.logo) {
      formData.append('logo', storeData.logo);
    }
    if (storeData.banner) {
      formData.append('banner', storeData.banner);
    }

    const response = await api.post('/stores', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },
  
  updateStore: async (storeId, storeData) => {
    const formData = new FormData();
    if (storeData.name !== undefined) formData.append('name', storeData.name);
    if (storeData.description !== undefined) formData.append('description', storeData.description);
    if (storeData.status !== undefined) formData.append('status', storeData.status);
    if (storeData.settings !== undefined) {
      formData.append('settings', JSON.stringify(storeData.settings));
    }
    if (storeData.logo !== undefined) {
      formData.append('logo', storeData.logo);
    }
    if (storeData.banner !== undefined) {
      formData.append('banner', storeData.banner);
    }

    const response = await api.patch(`/stores/${storeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
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