import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 FIX: Check karein ki failed request Login/Register/Forgot-Password toh nahi hai
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                           error.config?.url?.includes('/auth/register') ||
                           error.config?.url?.includes('/auth/forgot-password');

    // Agar 401 error hai AUR request auth endpoints ki nahi hai, tabhi redirect karo
    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      // Token expire ya invalid hai (Protected route ke liye)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    
    // Error ko hamesha reject karo taaki Redux (authSlice) usko catch karke UI par dikha sake
    return Promise.reject(error);
  }
);

export default api;