import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as settingService from '../services/setting.service.js';

export const getSettingsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const validCategories = ['general', 'security', 'commission', 'payment', 'email', 'notification', 'storage', 'system'];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category' });
  }

  const settings = await settingService.getSettingsByCategory(category);
  return res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const settings = req.body;

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid settings data' });
  }

  const updated = await settingService.updateSettings(settings, category, req.user._id);
  return res.status(200).json(new ApiResponse(200, updated, 'Settings updated successfully'));
});

export const getAllSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getAllSettings();
  return res.status(200).json(new ApiResponse(200, settings, 'All settings fetched successfully'));
});