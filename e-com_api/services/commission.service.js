import mongoose from 'mongoose';
import { Commission } from '../models/Commission.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';

const DEFAULT_COMMISSION_RATE = 0.10; // 10%

// Get all commissions with filters
export const getAllCommissions = async (query) => {
  const { page = 1, limit = 10, status, vendorId, search } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;
  if (vendorId) filter.vendor = vendorId;
  
  if (search) {
    // Search by order number
    const orders = await Order.find({ 
      orderNumber: { $regex: search, $options: 'i' } 
    }).select('_id');
    const orderIds = orders.map(o => o._id);
    filter.order = { $in: orderIds };
  }

  const commissions = await Commission.find(filter)
    .populate('order', 'orderNumber totalAmount status')
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalCommissions = await Commission.countDocuments(filter);

  return {
    commissions,
    totalPages: Math.ceil(totalCommissions / limit),
    currentPage: Number(page),
    totalCommissions
  };
};

// Get single commission
export const getCommissionById = async (commissionId) => {
  const commission = await Commission.findById(commissionId)
    .populate('order', 'orderNumber totalAmount status items')
    .populate('vendor', 'name email');
  
  if (!commission) throw new ApiError(404, 'Commission not found');
  return commission;
};

// Create commission (auto-called when order is created)
export const createCommission = async (order) => {
  const commissionAmount = order.totalAmount * DEFAULT_COMMISSION_RATE;
  const vendorAmount = order.totalAmount - commissionAmount;

  const commission = await Commission.create({
    order: order._id,
    vendor: order.vendor,
    orderAmount: order.totalAmount,
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    vendorAmount: Math.round(vendorAmount * 100) / 100,
    status: 'pending'
  });

  console.log('✅ Commission created:', {
    id: commission._id,
    order: order.orderNumber,
    amount: commission.commissionAmount,
    vendorAmount: commission.vendorAmount
  });

  return commission;
};

// Update commission status
export const updateCommissionStatus = async (commissionId, status, notes) => {
  const commission = await Commission.findById(commissionId);
  if (!commission) throw new ApiError(404, 'Commission not found');

  commission.status = status;
  if (status === 'collected') commission.collectedAt = new Date();
  if (notes) commission.notes = notes;
  
  await commission.save();
  return commission;
};

// Get commission analytics
export const getCommissionAnalytics = async () => {
  // Total stats
  const totalStats = await Commission.aggregate([
    { 
      $group: { 
        _id: null, 
        totalCommission: { $sum: '$commissionAmount' },
        totalVendorAmount: { $sum: '$vendorAmount' },
        totalOrderAmount: { $sum: '$orderAmount' },
        count: { $sum: 1 }
      } 
    }
  ]);

  // Status breakdown
  const statusBreakdown = await Commission.aggregate([
    { 
      $group: { 
        _id: '$status', 
        count: { $sum: 1 }, 
        amount: { $sum: '$commissionAmount' }
      } 
    }
  ]);

  // Vendor-wise commission
  const vendorWise = await Commission.aggregate([
    { 
      $group: { 
        _id: '$vendor', 
        totalCommission: { $sum: '$commissionAmount' },
        totalOrders: { $sum: 1 }
      } 
    },
    { $sort: { totalCommission: -1 } },
    { $limit: 10 }
  ]);

  // Populate vendor details
  const { User } = await import('../models/User.js');
  const vendorWiseWithDetails = await User.populate(vendorWise, {
    path: '_id',
    select: 'name email'
  });

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Commission.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        commission: { $sum: '$commissionAmount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalStats: totalStats[0] || { 
      totalCommission: 0, 
      totalVendorAmount: 0, 
      totalOrderAmount: 0, 
      count: 0 
    },
    statusBreakdown,
    vendorWise: vendorWiseWithDetails,
    monthlyTrend
  };
};

// Get vendor-specific commissions
export const getVendorCommissions = async (vendorId, query) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;
  const filter = { vendor: vendorId };

  if (status) filter.status = status;

  const commissions = await Commission.find(filter)
    .populate('order', 'orderNumber totalAmount status')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalCommissions = await Commission.countDocuments(filter);

  // Vendor totals
  const vendorStats = await Commission.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: null,
        totalCommission: { $sum: '$commissionAmount' },
        totalEarned: { $sum: '$vendorAmount' },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  return {
    commissions,
    totalPages: Math.ceil(totalCommissions / limit),
    currentPage: Number(page),
    totalCommissions,
    stats: vendorStats[0] || {
      totalCommission: 0,
      totalEarned: 0,
      totalOrders: 0
    }
  };
};

// Mark commission as refunded (when order is cancelled)
export const refundCommission = async (orderId) => {
  const commission = await Commission.findOne({ order: orderId });
  if (!commission) return null;

  commission.status = 'refunded';
  commission.notes = 'Order cancelled - commission refunded';
  await commission.save();

  return commission;
};