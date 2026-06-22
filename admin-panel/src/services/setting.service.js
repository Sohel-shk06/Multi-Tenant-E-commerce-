import api from './api';

export const settingService = {
  getAllSettings: async () => {
    const response = await api.get('/settings');
    return response.data.data;
  },

  getSettingsByCategory: async (category) => {
    const response = await api.get(`/settings/${category}`);
    return response.data.data;
  },

  updateSettings: async (category, settings) => {
    const response = await api.patch(`/settings/${category}`, settings);
    return response.data.data;
  }
};