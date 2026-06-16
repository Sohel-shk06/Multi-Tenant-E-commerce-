import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as storeService from '../services/store.service.js';

export const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getAllStores(req.query, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, result, 'Stores fetched successfully'));
});

export const getStore = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(req.params.storeId, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, store, 'Store fetched successfully'));
});

export const createStore = asyncHandler(async (req, res) => {
  console.log('📥 Creating store with data:', req.body); // Debug log
  console.log('👤 User:', req.user); // Debug log
  
  let vendorId;
  
  // ✅ FIX: Vendor ke liye logged-in user ka ID use karo
  if (req.user.role === 'vendor') {
    vendorId = req.user._id;
  } else if (req.user.role === 'admin') {
    vendorId = req.body.vendor;
    if (!vendorId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vendor ID is required when admin creates a store' 
      });
    }
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Only vendors and admins can create stores' 
    });
  }

  try {
    const store = await storeService.createStore(req.body, vendorId);
    console.log('✅ Store created:', store._id);
    return res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
  } catch (error) {
    console.error('❌ Error creating store:', error);
    throw error;
  }
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await storeService.updateStore(req.params.storeId, req.body, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, store, 'Store updated successfully'));
});

export const deleteStore = asyncHandler(async (req, res) => {
  await storeService.deleteStore(req.params.storeId, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, null, 'Store deleted successfully'));
});

// ===== PUBLIC: Customer Facing Controllers =====

export const getPublicStores = asyncHandler(async (req, res) => {
  const result = await storeService.getPublicStores(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Stores fetched successfully'));
});

export const getPublicStore = asyncHandler(async (req, res) => {
  const store = await storeService.getPublicStore(req.params.storeId);
  return res.status(200).json(new ApiResponse(200, store, 'Store fetched successfully'));
});

export const getStoreProducts = asyncHandler(async (req, res) => {
  const result = await storeService.getStoreProducts(req.params.storeId, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Store products fetched successfully'));
});