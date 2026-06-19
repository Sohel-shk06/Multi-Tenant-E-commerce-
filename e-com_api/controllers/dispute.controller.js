import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as disputeService from '../services/dispute.service.js';

// ===== ADMIN CONTROLLERS =====

export const adminGetAllDisputes = asyncHandler(async (req, res) => {
  const result = await disputeService.getAllDisputes(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Disputes fetched successfully'));
});

export const adminGetDisputeById = asyncHandler(async (req, res) => {
  const dispute = await disputeService.getDisputeById(req.params.disputeId);
  return res.status(200).json(new ApiResponse(200, dispute, 'Dispute fetched successfully'));
});

export const adminResolveDispute = asyncHandler(async (req, res) => {
  const { resolution, refundAmount, adminNotes } = req.body;
  
  if (!resolution) {
    throw new ApiError(400, 'Resolution is required');
  }

  const dispute = await disputeService.resolveDispute(
    req.user._id,
    req.params.disputeId,
    { resolution, refundAmount, adminNotes }
  );
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Dispute resolved successfully'));
});

export const adminUpdateDisputeStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  
  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const dispute = await disputeService.updateDisputeStatus(
    req.params.disputeId,
    status,
    adminNotes
  );
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Dispute status updated successfully'));
});

export const adminGetDisputeAnalytics = asyncHandler(async (req, res) => {
  const analytics = await disputeService.getDisputeAnalytics();
  return res.status(200).json(new ApiResponse(200, analytics, 'Dispute analytics fetched successfully'));
});

// ===== CUSTOMER CONTROLLERS =====

export const customerCreateDispute = asyncHandler(async (req, res) => {
  const dispute = await disputeService.createDispute(
    req.user._id,
    'customer',
    req.body
  );
  return res.status(201).json(new ApiResponse(201, dispute, 'Dispute raised successfully'));
});

export const customerGetDisputes = asyncHandler(async (req, res) => {
  const result = await disputeService.getCustomerDisputes(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Customer disputes fetched successfully'));
});

export const customerGetDisputeById = asyncHandler(async (req, res) => {
  const dispute = await disputeService.getDisputeById(req.params.disputeId);
  
  // Authorization check
  if (dispute.customer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to view this dispute');
  }
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Dispute fetched successfully'));
});

export const customerReplyToDispute = asyncHandler(async (req, res) => {
  const { message, attachments } = req.body;
  
  if (!message || !message.trim()) {
    throw new ApiError(400, 'Message is required');
  }

  const dispute = await disputeService.customerReplyToDispute(
    req.user._id,
    req.params.disputeId,
    message.trim(),
    attachments
  );
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Reply submitted successfully'));
});

// ===== VENDOR CONTROLLERS =====

export const vendorGetDisputes = asyncHandler(async (req, res) => {
  const result = await disputeService.getVendorDisputes(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vendor disputes fetched successfully'));
});

export const vendorGetDisputeById = asyncHandler(async (req, res) => {
  const dispute = await disputeService.getDisputeById(req.params.disputeId);
  
  // Authorization check
  if (dispute.vendor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to view this dispute');
  }
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Dispute fetched successfully'));
});

export const vendorReplyToDispute = asyncHandler(async (req, res) => {
  const { message, attachments } = req.body;
  
  if (!message || !message.trim()) {
    throw new ApiError(400, 'Message is required');
  }

  const dispute = await disputeService.vendorReplyToDispute(
    req.user._id,
    req.params.disputeId,
    message.trim(),
    attachments
  );
  
  return res.status(200).json(new ApiResponse(200, dispute, 'Reply submitted successfully'));
});