import api from './api';

export const productService = {
  // ===== PUBLIC: Customer Facing (No Auth Required) =====
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  },

  // ===== PROTECTED: Vendor/Admin Facing (Requires Auth) =====
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.patch(`/products/${productId}`, productData);
    return response.data.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data.data;
  },

  // Moderation (Admin only)
  getProductsForModeration: async (params) => {
    const response = await api.get('/products/moderation/pending', { params });
    return response.data.data;
  },

  moderateProduct: async (productId, action, notes = '') => {
    const response = await api.patch(`/products/${productId}/moderate`, { action, notes });
    return response.data.data;
  },

  uploadImages: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};