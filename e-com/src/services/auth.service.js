import api from './api';

export const authService = {
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  verifyEmail: async (token) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },
  
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  
  changePassword: async (passwords) => {
    const response = await api.post('/auth/change-password', passwords);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  },

  requestEmailChange: async (newEmail) => {
    const response = await api.post('/auth/request-email-change', { newEmail });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};