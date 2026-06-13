// ===== ADMIN: Payment Management Functions =====
import { Payout } from '../models/Payment.js';
// import { Payout } from '../models/Payout.js';

import { ApiError } from '../utils/ApiError.js';

export const getAllTransactions = async (query) => {
  const { page = 1, limit = 10, status, search, paymentMethod } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.paymentStatus = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  
  if (search) {
    filter.$or = [
      { transactionId: { $regex: search, $options: 'i' } },
    ];
  }

  const transactions = await Payment.find(filter)
    .populate('order', 'orderNumber totalAmount')
    .populate('customer', 'name email')
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalTransactions = await Payment.countDocuments(filter);

  return {
    transactions,
    totalPages: Math.ceil(totalTransactions / limit),
    currentPage: Number(page),
    totalTransactions
  };
};

export const getTransactionById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate('order', 'orderNumber totalAmount items')
    .populate('customer', 'name email phone')
    .populate('vendor', 'name email');
  
  if (!payment) throw new ApiError(404, 'Transaction not found');
  return payment;
};

export const getAllPayouts = async (query) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;

  const payouts = await Payout.find(filter)
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ requestedAt: -1 });

  const totalPayouts = await Payout.countDocuments(filter);

  return {
    payouts,
    totalPages: Math.ceil(totalPayouts / limit),
    currentPage: Number(page),
    totalPayouts
  };
};

export const updatePayoutStatus = async (payoutId, status, notes) => {
  const payout = await Payout.findById(payoutId);
  if (!payout) throw new ApiError(404, 'Payout not found');

  payout.status = status;
  if (status === 'processed') payout.processedAt = new Date();
  if (notes) payout.adminNotes = notes;
  
  await payout.save();
  return payout;
};

export const getPaymentAnalytics = async () => {
  // Total stats
  const totalStats = await Payment.aggregate([
    { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);

  // Status breakdown
  const statusBreakdown = await Payment.aggregate([
    { $group: { _id: '$paymentStatus', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
  ]);

  // Payment method breakdown
  const methodBreakdown = await Payment.aggregate([
    { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
  ]);

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Payment.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        amount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalStats: totalStats[0] || { totalAmount: 0, count: 0 },
    statusBreakdown,
    methodBreakdown,
    monthlyTrend
  };
};