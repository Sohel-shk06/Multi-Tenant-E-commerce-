import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as storeService from '../services/store.service.js';

export const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getAllStores(req.query, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, result, 'Stores fetched successfully'));
});

// ✅ FIXED: category populate remove kiya (Store model mein nahi hai)
export const getStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  
  console.log('\n🏪 ========== GET STORE ==========');
  console.log('📋 Store ID:', storeId);

  try {
    const { Store } = await import('../models/Store.js');
    
    // ✅ category populate HATA DIYA - Store model mein category field nahi hai
    const store = await Store.findById(storeId)
      .populate('vendor', 'name email');
    
    if (!store) {
      console.log('❌ Store not found');
      throw new ApiError(404, 'Store not found');
    }

    console.log('✅ Store found:', store.name);
    console.log('🔍 ========== END ==========\n');

    return res.status(200).json(new ApiResponse(200, store, 'Store fetched successfully'));
  } catch (error) {
    console.error('❌ Error in getStore:', error.message);
    console.error('❌ Stack:', error.stack);
    console.log('🔍 ========== END ==========\n');
    
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to fetch store: ${error.message}`);
  }
});

// ✅ UPDATED: createStore with file upload
export const createStore = asyncHandler(async (req, res) => {
  console.log('📥 Creating store with data:', req.body);
  console.log('📁 Files received:', req.files);
  console.log('👤 User:', req.user);
  
  let vendorId;
  
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
    const store = await storeService.createStore(req.body, vendorId, req.files);
    console.log('✅ Store created:', store._id);
    return res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
  } catch (error) {
    console.error('❌ Error creating store:', error);
    throw error;
  }
});

// ✅ NEW: updateStore with file upload
export const updateStoreWithImages = asyncHandler(async (req, res) => {
  const store = await storeService.updateStoreWithImages(
    req.params.storeId, 
    req.body, 
    req.files,
    req.user._id,
    req.user.role
  );
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

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(req.params.storeId);
  return res.status(200).json(new ApiResponse(200, store, 'Store fetched successfully'));
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await storeService.updateStoreById(req.params.storeId, req.body);
  return res.status(200).json(new ApiResponse(200, store, 'Store updated successfully'));
});

export const getStoreAnalytics = asyncHandler(async (req, res) => {
  const analytics = await storeService.getStoreAnalytics(req.params.storeId);
  return res.status(200).json(new ApiResponse(200, analytics, 'Store analytics fetched successfully'));
});