import mongoose from 'mongoose';
import { Setting } from '../models/Setting.js';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// Get all settings by category
// ============================================
export const getSettingsByCategory = async (category) => {
  try {
    const settings = await Setting.find({ category });
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    return settingsMap;
  } catch (error) {
    console.error('❌ Error in getSettingsByCategory:', error);
    throw new ApiError(500, 'Failed to fetch settings');
  }
};

// ============================================
// Get single setting
// ============================================
export const getSetting = async (key) => {
  try {
    const setting = await Setting.findOne({ key });
    if (!setting) return null;
    return setting.value;
  } catch (error) {
    console.error('❌ Error in getSetting:', error);
    throw new ApiError(500, 'Failed to fetch setting');
  }
};

// ============================================
// Update multiple settings (bulk update)
// ============================================
export const updateSettings = async (settings, category, adminId) => {
  try {
    const operations = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key, category },
        update: {
          $set: {
            value,
            category,
            updatedAt: new Date(),
            updatedBy: adminId
          }
        },
        upsert: true
      }
    }));

    await Setting.bulkWrite(operations);
    return await getSettingsByCategory(category);
  } catch (error) {
    console.error('❌ Error in updateSettings:', error);
    throw new ApiError(500, 'Failed to update settings');
  }
};

// ============================================
// Get all settings (grouped by category)
// ============================================
export const getAllSettings = async () => {
  try {
    const settings = await Setting.find({});
    const grouped = {};
    settings.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = {};
      grouped[s.category][s.key] = s.value;
    });
    return grouped;
  } catch (error) {
    console.error('❌ Error in getAllSettings:', error);
    throw new ApiError(500, 'Failed to fetch settings');
  }
};