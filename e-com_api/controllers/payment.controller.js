// ===== ADMIN: Payment Management Controllers =====
import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as paymentService from '../services/payment.service.js';


export const adminGetAllTransactions = asyncHandler(async (req, res) => {
  const result = await paymentService.getAllTransactions(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Transactions fetched successfully'));
});

export const adminGetTransactionById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getTransactionById(req.params.paymentId);
  return res.status(200).json(new ApiResponse(200, payment, 'Transaction fetched successfully'));
});

export const adminGetAllPayouts = asyncHandler(async (req, res) => {
  const result = await paymentService.getAllPayouts(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Payouts fetched successfully'));
});

export const adminUpdatePayoutStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  if (!status) {
    throw new ApiError(400, 'Status is required');
  }
  
  const validStatuses = ['pending', 'processed', 'failed', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  const payout = await paymentService.updatePayoutStatus(req.params.payoutId, status, notes);
  return res.status(200).json(new ApiResponse(200, payout, 'Payout status updated successfully'));
});

export const adminGetPaymentAnalytics = asyncHandler(async (req, res) => {
  const analytics = await paymentService.getPaymentAnalytics();
  return res.status(200).json(new ApiResponse(200, analytics, 'Payment analytics fetched successfully'));
});