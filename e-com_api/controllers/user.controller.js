import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as userService from '../services/user.service.js';

// ===== Profile =====
export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
  }
  const result = await userService.changePassword(req.user._id, currentPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, result, 'Password changed successfully'));
});

// ===== Addresses =====
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await userService.getUserAddresses(req.user._id);
  return res.status(200).json(new ApiResponse(200, addresses, 'Addresses fetched successfully'));
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.addAddress(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, addresses, 'Address added successfully'));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.updateAddress(req.user._id, req.params.addressId, req.body);
  return res.status(200).json(new ApiResponse(200, addresses, 'Address updated successfully'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.deleteAddress(req.user._id, req.params.addressId);
  return res.status(200).json(new ApiResponse(200, addresses, 'Address deleted successfully'));
});


// ===== Vendor Settings =====
export const getVendorSettings = asyncHandler(async (req, res) => {
  const settings = await userService.getVendorSettings(req.user._id);
  return res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
});

export const updateBusinessInfo = asyncHandler(async (req, res) => {
  const result = await userService.updateBusinessInfo(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Business info updated successfully'));
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const result = await userService.updateNotificationPreferences(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Notification preferences updated successfully'));
});

export const updateBankDetails = asyncHandler(async (req, res) => {
  const result = await userService.updateBankDetails(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Bank details updated successfully'));
});

export const deleteVendorAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  await userService.deleteVendorAccount(req.user._id, password);
  return res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});