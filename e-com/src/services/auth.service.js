import api from './api';

export const authService = {
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // ✅ NEW: Verify Registration OTP
  verifyRegistrationOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-registration-otp', { email, otp });
    return response.data;
  },

  // ✅ NEW: Resend Registration OTP
  resendRegistrationOtp: async (email) => {
    const response = await api.post('/auth/resend-registration-otp', { email });
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

  // ✅ NEW: Forgot Password (OTP based)
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // ✅ NEW: Verify Reset OTP
  verifyResetOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },

  // ✅ NEW: Reset Password with OTP
  resetPasswordWithOtp: async (email, otp, newPassword) => {
    const response = await api.post('/auth/reset-password-with-otp', { email, otp, newPassword });
    return response.data;
  },

  // ✅ NEW: Request Email Change
  requestEmailChange: async (newEmail) => {
    const response = await api.post('/auth/request-email-change', { newEmail });
    return response.data;
  },

  // ✅ NEW: Verify Email Change
  verifyEmailChange: async (otp) => {
    const response = await api.post('/auth/verify-email-change', { otp });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};