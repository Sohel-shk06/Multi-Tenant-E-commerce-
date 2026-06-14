import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as commissionService from '../services/commission.service.js';

// Admin: Get all commissions
export const adminGetAllCommissions = asyncHandler(async (req, res) => {
  const result = await commissionService.getAllCommissions(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Commissions fetched successfully'));
});

// Admin: Get single commission
export const adminGetCommissionById = asyncHandler(async (req, res) => {
  const commission = await commissionService.getCommissionById(req.params.commissionId);
  return res.status(200).json(new ApiResponse(200, commission, 'Commission fetched successfully'));
});

// Admin: Update commission status
export const adminUpdateCommissionStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  if (!status) {
    throw new ApiError(400, 'Status is required');
  }
  
  const validStatuses = ['pending', 'earned', 'collected', 'refunded'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  const commission = await commissionService.updateCommissionStatus(
    req.params.commissionId, 
    status, 
    notes
  );
  return res.status(200).json(new ApiResponse(200, commission, 'Commission status updated successfully'));
});

// Admin: Get commission analytics
export const adminGetCommissionAnalytics = asyncHandler(async (req, res) => {
  const analytics = await commissionService.getCommissionAnalytics();
  return res.status(200).json(new ApiResponse(200, analytics, 'Commission analytics fetched successfully'));
});

// Vendor: Get own commissions
export const vendorGetCommissions = asyncHandler(async (req, res) => {
  const result = await commissionService.getVendorCommissions(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vendor commissions fetched successfully'));
});