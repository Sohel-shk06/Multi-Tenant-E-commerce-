import api from './api';

export const categoryService = {
  getCategories: async (params) => {
    const response = await api.get('/categories', { params });
    return response.data.data;
  },

  getCategory: async (categoryId) => {  // ✅ YE ADD KAREIN
    const response = await api.get(`/categories/${categoryId}`);
    return response.data.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data.data;
  },

  updateCategory: async (categoryId, categoryData) => {  // ✅ YE ADD KAREIN
    const response = await api.patch(`/categories/${categoryId}`, categoryData);
    return response.data.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data.data;
  }
};