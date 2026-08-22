import api from './api';

export const authService = {
  // User Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // User Registration (Customer/Vendor)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get Current Logged-in User
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

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  requestEmailChange: async (newEmail) => {
    const response = await api.post('/auth/request-email-change', { newEmail });
    return response.data;
  },
  
  changePassword: async (data) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};