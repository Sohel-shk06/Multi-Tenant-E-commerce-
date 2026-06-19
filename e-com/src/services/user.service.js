import api from './api';

export const userService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.patch('/user/profile', profileData);
    return response.data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/user/change-password', { currentPassword, newPassword });
    return response.data.data;
  },

  // Addresses
  getAddresses: async () => {
    const response = await api.get('/user/addresses');
    return response.data.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/user/addresses', addressData);
    return response.data.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await api.patch(`/user/addresses/${addressId}`, addressData);
    return response.data.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/user/addresses/${addressId}`);
    return response.data.data;
  },

  // ===== Vendor Settings =====
getVendorSettings: async () => {
  const response = await api.get('/user/settings');
  return response.data.data;
},

updateBusinessInfo: async (businessData) => {
  const response = await api.patch('/user/settings/business', businessData);
  return response.data.data;
},

updateNotificationPreferences: async (preferences) => {
  const response = await api.patch('/user/settings/notifications', preferences);
  return response.data.data;
},

updateBankDetails: async (bankData) => {
  const response = await api.patch('/user/settings/bank', bankData);
  return response.data.data;
},

deleteVendorAccount: async (password) => {
  const response = await api.delete('/user/settings/account', { data: { password } });
  return response.data.data;
},
};