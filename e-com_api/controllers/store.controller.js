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
  // Agar admin hai, toh body se vendorId lo, warna logged-in vendor ka ID use karo
  const vendorId = req.user.role === 'admin' ? req.body.vendor : req.user._id;
  
  if (!vendorId) {
    return res.status(400).json({ success: false, message: 'Vendor ID is required' });
  }

  const store = await storeService.createStore(req.body, vendorId);
  return res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await storeService.updateStore(req.params.storeId, req.body, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, store, 'Store updated successfully'));
});

export const deleteStore = asyncHandler(async (req, res) => {
  await storeService.deleteStore(req.params.storeId, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, null, 'Store deleted successfully'));
});