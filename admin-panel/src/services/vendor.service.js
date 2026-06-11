import api from './api';

export const vendorService = {
  getVendors: async (params) => {
    const response = await api.get('/vendors', { params });
    return response.data.data; // Returns { vendors, totalPages, currentPage, totalVendors }
  },

  updateVendorStatus: async (vendorId, status) => {
    const response = await api.patch(`/vendors/${vendorId}/status`, { status });
    return response.data.data;
  },

  createVendor: async (vendorData) => {
    const response = await api.post('/vendors', vendorData);
    return response.data.data;
  }
};