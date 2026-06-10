import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Subscription } from '../models/Subscription.js';
import { Commission } from '../models/Commission.js';

// Get Admin Dashboard Stats
export const getAdminDashboardStats = async () => {
  // Total Revenue (from completed orders)
  const revenueResult = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Total Vendors
  const totalVendors = await User.countDocuments({ role: 'vendor' });

  // Total Customers
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  // Total Orders
  const totalOrders = await Order.countDocuments();

  // Subscription MRR (Monthly Recurring Revenue)
  const subscriptionResult = await Subscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const subscriptionMRR = subscriptionResult[0]?.total || 0;

  // Commission Earned
  const commissionResult = await Commission.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const commissionEarned = commissionResult[0]?.total || 0;

  return {
    totalRevenue,
    totalVendors,
    totalCustomers,
    totalOrders,
    subscriptionMRR,
    commissionEarned
  };
};

// Get Revenue Chart Data
export const getRevenueChartData = async (timeframe = 'monthly') => {
  let groupFormat;
  
  if (timeframe === 'daily') {
    groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  } else if (timeframe === 'weekly') {
    groupFormat = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
  } else {
    groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
  }

  const revenueData = await Order.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: groupFormat,
        revenue: { $sum: '$totalAmount' },
        commission: { $sum: { $multiply: ['$totalAmount', 0.1] } }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        name: '$_id',
        revenue: 1,
        commission: 1,
        _id: 0
      }
    }
  ]);

  // Agar data nahi hai, toh dummy data return karein chart display ke liye
  if (revenueData.length === 0) {
    return [
      { name: 'Jan', revenue: 45000, commission: 4500 },
      { name: 'Feb', revenue: 52000, commission: 5200 },
      { name: 'Mar', revenue: 61000, commission: 6100 },
      { name: 'Apr', revenue: 58000, commission: 5800 },
      { name: 'May', revenue: 72000, commission: 7200 },
      { name: 'Jun', revenue: 85000, commission: 8500 }
    ];
  }

  return revenueData;
};