import mongoose from 'mongoose';
import { Dispute } from '../models/Dispute.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';

// ===== ADMIN: Get all disputes =====
export const getAllDisputes = async (query) => {
  const { page = 1, limit = 10, status, priority, search } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  
  if (search) {
    filter.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const disputes = await Dispute.find(filter)
    .populate('order', 'orderNumber totalAmount status')
    .populate('raisedBy', 'name email')
    .populate('vendor', 'name email')
    .populate('customer', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalDisputes = await Dispute.countDocuments(filter);

  // Status counts for dashboard
  const statusCounts = await Dispute.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const statusMap = {
    open: 0,
    under_review: 0,
    vendor_responded: 0,
    resolved_customer: 0,
    resolved_vendor: 0,
    closed: 0
  };
  statusCounts.forEach(s => { statusMap[s._id] = s.count; });

  return {
    disputes,
    totalPages: Math.ceil(totalDisputes / limit),
    currentPage: Number(page),
    totalDisputes,
    statusCounts: statusMap
  };
};

// ===== ADMIN: Get single dispute =====
export const getDisputeById = async (disputeId) => {
  const dispute = await Dispute.findById(disputeId)
    .populate('order', 'orderNumber totalAmount status items paymentMethod paymentStatus')
    .populate('raisedBy', 'name email phone')
    .populate('vendor', 'name email phone')
    .populate('customer', 'name email phone')
    .populate('messages.sender', 'name email');

  if (!dispute) throw new ApiError(404, 'Dispute not found');
  return dispute;
};

// ===== CUSTOMER/VENDOR: Create dispute =====
export const createDispute = async (userId, userRole, disputeData) => {
  const { orderId, subject, reason, description, evidence, priority } = disputeData;

  // Order dhundhein
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  // Authorization check
  if (userRole === 'customer' && order.customer.toString() !== userId) {
    throw new ApiError(403, 'You can only raise disputes for your own orders');
  }
  if (userRole === 'vendor' && order.vendor.toString() !== userId) {
    throw new ApiError(403, 'You can only raise disputes for your own orders');
  }

  // Check if dispute already exists for this order
  const existingDispute = await Dispute.findOne({ order: orderId, status: { $ne: 'closed' } });
  if (existingDispute) {
    throw new ApiError(400, 'A dispute is already open for this order');
  }

  // Dispute create karein
  const dispute = await Dispute.create({
    order: orderId,
    raisedBy: userId,
    vendor: order.vendor,
    customer: order.customer,
    subject,
    reason,
    description,
    evidence: evidence || [],
    priority: priority || 'medium',
    status: 'open',
    messages: [{
      sender: userId,
      senderRole: userRole,
      message: description
    }]
  });

  return dispute;
};

// ===== VENDOR: Reply to dispute =====
export const vendorReplyToDispute = async (vendorId, disputeId, message, attachments) => {
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new ApiError(404, 'Dispute not found');

  if (dispute.vendor.toString() !== vendorId) {
    throw new ApiError(403, 'You are not authorized to reply to this dispute');
  }

  if (dispute.status === 'closed') {
    throw new ApiError(400, 'Cannot reply to a closed dispute');
  }

  // Message add karein
  dispute.messages.push({
    sender: vendorId,
    senderRole: 'vendor',
    message,
    attachments: attachments || []
  });

  // Status update karein
  dispute.status = 'vendor_responded';
  await dispute.save();

  return dispute;
};

// ===== CUSTOMER: Reply to dispute =====
export const customerReplyToDispute = async (customerId, disputeId, message, attachments) => {
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new ApiError(404, 'Dispute not found');

  if (dispute.customer.toString() !== customerId) {
    throw new ApiError(403, 'You are not authorized to reply to this dispute');
  }

  if (dispute.status === 'closed') {
    throw new ApiError(400, 'Cannot reply to a closed dispute');
  }

  dispute.messages.push({
    sender: customerId,
    senderRole: 'customer',
    message,
    attachments: attachments || []
  });

  await dispute.save();
  return dispute;
};

// ===== ADMIN: Resolve dispute =====
export const resolveDispute = async (adminId, disputeId, resolutionData) => {
  const { resolution, refundAmount, adminNotes } = resolutionData;

  const dispute = await Dispute.findById(disputeId)
    .populate('order', 'totalAmount paymentStatus');

  if (!dispute) throw new ApiError(404, 'Dispute not found');

  if (dispute.status === 'closed') {
    throw new ApiError(400, 'Dispute is already closed');
  }

  // Resolution validation
  const validResolutions = ['full_refund', 'partial_refund', 'replacement', 'rejected'];
  if (!validResolutions.includes(resolution)) {
    throw new ApiError(400, 'Invalid resolution type');
  }

  // Refund amount validation
  if (resolution === 'full_refund') {
    dispute.refundAmount = dispute.order.totalAmount;
  } else if (resolution === 'partial_refund') {
    if (!refundAmount || refundAmount <= 0) {
      throw new ApiError(400, 'Refund amount is required for partial refund');
    }
    if (refundAmount > dispute.order.totalAmount) {
      throw new ApiError(400, 'Refund amount cannot exceed order total');
    }
    dispute.refundAmount = refundAmount;
  } else {
    dispute.refundAmount = 0;
  }

  dispute.resolution = resolution;
  dispute.adminNotes = adminNotes || '';
  dispute.resolvedAt = new Date();
  dispute.resolvedBy = adminId;
  dispute.status = resolution === 'rejected' ? 'resolved_vendor' : 'resolved_customer';

  // Admin message add karein
  let resolutionMessage = `Dispute resolved: ${resolution.replace('_', ' ').toUpperCase()}`;
  if (dispute.refundAmount > 0) {
    resolutionMessage += ` - Refund of ₹${dispute.refundAmount} will be processed`;
  }
  if (adminNotes) {
    resolutionMessage += `\n\nAdmin Notes: ${adminNotes}`;
  }

  dispute.messages.push({
    sender: adminId,
    senderRole: 'admin',
    message: resolutionMessage
  });

  await dispute.save();

  // ✅ Agar refund hai, toh Payment status update karein
  if (dispute.refundAmount > 0) {
    try {
      await Payment.findOneAndUpdate(
        { order: dispute.order._id },
        { 
          paymentStatus: 'refunded',
          gatewayResponse: {
            source: 'dispute-resolution',
            disputeId: dispute._id,
            refundAmount: dispute.refundAmount,
            resolution: resolution,
            refundedAt: new Date()
          }
        }
      );
      console.log('✅ Payment marked as refunded for dispute:', dispute._id);
    } catch (error) {
      console.error('⚠️  Payment refund update failed:', error.message);
    }
  }

  return dispute;
};

// ===== ADMIN: Update dispute status =====
export const updateDisputeStatus = async (disputeId, status, adminNotes) => {
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new ApiError(404, 'Dispute not found');

  dispute.status = status;
  if (adminNotes) dispute.adminNotes = adminNotes;
  if (status === 'closed') dispute.resolvedAt = new Date();
  
  await dispute.save();
  return dispute;
};

// ===== VENDOR: Get own disputes =====
export const getVendorDisputes = async (vendorId, query) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;
  const filter = { vendor: vendorId };

  if (status) filter.status = status;

  const disputes = await Dispute.find(filter)
    .populate('order', 'orderNumber totalAmount')
    .populate('customer', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalDisputes = await Dispute.countDocuments(filter);

  return {
    disputes,
    totalPages: Math.ceil(totalDisputes / limit),
    currentPage: Number(page),
    totalDisputes
  };
};

// ===== CUSTOMER: Get own disputes =====
export const getCustomerDisputes = async (customerId, query) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;
  const filter = { customer: customerId };

  if (status) filter.status = status;

  const disputes = await Dispute.find(filter)
    .populate('order', 'orderNumber totalAmount')
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalDisputes = await Dispute.countDocuments(filter);

  return {
    disputes,
    totalPages: Math.ceil(totalDisputes / limit),
    currentPage: Number(page),
    totalDisputes
  };
};

// ===== ADMIN: Dispute Analytics =====
export const getDisputeAnalytics = async () => {
  // Total stats
  const totalStats = await Dispute.aggregate([
    { $group: { _id: null, total: { $sum: 1 }, totalRefund: { $sum: '$refundAmount' } } }
  ]);

  // Status breakdown
  const statusBreakdown = await Dispute.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Reason breakdown
  const reasonBreakdown = await Dispute.aggregate([
    { $group: { _id: '$reason', count: { $sum: 1 } } }
  ]);

  // Resolution breakdown
  const resolutionBreakdown = await Dispute.aggregate([
    { $group: { _id: '$resolution', count: { $sum: 1 }, refundAmount: { $sum: '$refundAmount' } } }
  ]);

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Dispute.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalStats: totalStats[0] || { total: 0, totalRefund: 0 },
    statusBreakdown,
    reasonBreakdown,
    resolutionBreakdown,
    monthlyTrend
  };
};