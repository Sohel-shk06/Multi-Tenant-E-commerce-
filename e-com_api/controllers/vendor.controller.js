import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as vendorService from '../services/vendor.service.js';

export const getVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.getAllVendors(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vendors fetched successfully'));
});

export const updateVendorStatus = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const { status } = req.body;
  
  const vendor = await vendorService.updateVendorStatus(vendorId, status);
  return res.status(200).json(new ApiResponse(200, vendor, `Vendor ${status} successfully`));
});

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendorByAdmin(req.body);
  return res.status(201).json(new ApiResponse(201, vendor, 'Vendor created successfully'));
});