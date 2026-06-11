import api from './api';

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories?limit=100');
    return response.data.data.categories;
  }
};