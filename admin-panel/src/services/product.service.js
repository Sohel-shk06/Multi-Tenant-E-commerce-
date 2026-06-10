import api from './api';

export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  },

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

  updateProductStatus: async (productId, status) => {
    const response = await api.patch(`/products/${productId}/status`, { status });
    return response.data.data;
  }
};