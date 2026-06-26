import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Subscription } from '../models/Subscription.js';
import { Commission } from '../models/Commission.js';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';


export const getAdminDashboardStats = async () => {

  const revenueResult = await Order.aggregate([
    { $match: { status: { $in: ['delivered', 'completed'] } } }, 
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  
  const totalVendors = await User.countDocuments({ role: 'vendor' });

  
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  
  const totalOrders = await Order.countDocuments();

  // Subscription MRR (Monthly Recurring Revenue)
  const subscriptionResult = await Subscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const subscriptionMRR = subscriptionResult[0]?.total || 0;

  // ✅ FIXED: Commission Earned
  const commissionResult = await Commission.aggregate([
    { 
      $match: { 
        status: { $in: ['earned', 'collected'] }
      } 
    },
    { 
      $group: { 
        _id: null, 
        total: { $sum: '$commissionAmount' }
      } 
    }
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


// Top Vendors by Revenue (Current Month)
export const getTopVendors = async (limit = 5) => {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const topVendors = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: currentMonth },
        status: { $in: ['delivered', 'completed'] }
      }
    },
    {
      $group: {
        _id: '$vendor',
        totalSales: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { totalSales: -1 } },
    { $limit: limit }
  ]);

  // Vendor details populate karein
  const topVendorsWithDetails = await User.populate(topVendors, {
    path: '_id',
    select: 'name email'
  });

  return topVendorsWithDetails;
};



// ADMIN: Revenue Analytics
// ============================================
export const getAdminRevenueAnalytics = async (query) => {
  try {
    const { period = 'monthly', startDate, endDate } = query;
    
    let dateFormat;
    if (period === 'daily') dateFormat = '%Y-%m-%d';
    else if (period === 'weekly') dateFormat = '%Y-W%V';
    else dateFormat = '%Y-%m';

    const matchStage = { status: { $in: ['delivered', 'completed'] } };
    
    if (startDate && endDate) {
      matchStage.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const revenueData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);

    // Commission calculation (10%)
    const totalCommission = totalRevenue * 0.10;
    const netRevenue = totalRevenue - totalCommission;

    return {
      data: revenueData.map(d => ({
        period: d._id,
        revenue: d.revenue,
        orders: d.orders,
        avgOrderValue: Math.round(d.avgOrderValue || 0)
      })),
      summary: {
        totalRevenue,
        netRevenue,
        totalCommission,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
      }
    };
  } catch (error) {
    console.error('❌ Error in getAdminRevenueAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch revenue analytics');
  }
};

// ============================================
// ADMIN: Vendor Analytics
// ============================================
export const getAdminVendorAnalytics = async () => {
  try {
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const activeVendors = await User.countDocuments({ role: 'vendor', status: 'active' });
    const pendingVendors = await User.countDocuments({ role: 'vendor', status: 'pending' });
    const suspendedVendors = await User.countDocuments({ role: 'vendor', status: 'suspended' });

    // Vendor wise revenue
    const vendorRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'completed'] } } },
      {
        $group: {
          _id: '$vendor',
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    const vendorRevenueWithDetails = await User.populate(vendorRevenue, {
      path: '_id',
      select: 'name email'
    });

    // New vendors this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newVendorsThisMonth = await User.countDocuments({
      role: 'vendor',
      createdAt: { $gte: startOfMonth }
    });

    return {
      summary: {
        totalVendors,
        activeVendors,
        pendingVendors,
        suspendedVendors,
        newVendorsThisMonth
      },
      topVendors: vendorRevenueWithDetails
    };
  } catch (error) {
    console.error('❌ Error in getAdminVendorAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch vendor analytics');
  }
};

// ============================================
// ADMIN: Customer Analytics
// ============================================
export const getAdminCustomerAnalytics = async () => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // New customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfMonth }
    });

    // Active customers (ordered in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCustomers = await Order.distinct('customer', {
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Customer acquisition trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const acquisitionTrend = await User.aggregate([
      { 
        $match: { 
          role: 'customer',
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'completed'] } } },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    const topCustomersWithDetails = await User.populate(topCustomers, {
      path: '_id',
      select: 'name email'
    });

    return {
      summary: {
        totalCustomers,
        activeCustomers: activeCustomers.length,
        newCustomersThisMonth
      },
      acquisitionTrend,
      topCustomers: topCustomersWithDetails
    };
  } catch (error) {
    console.error('❌ Error in getAdminCustomerAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch customer analytics');
  }
};

// ============================================
// ADMIN: Sales Analytics
// ============================================
export const getAdminSalesAnalytics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Today's sales
    const todayStats = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // This month
    const thisMonthStats = await Order.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Last month
    const lastMonthStats = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth }, status: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Growth calculation
    const currentMonthRevenue = thisMonthStats[0]?.revenue || 0;
    const lastMonthRevenue = lastMonthStats[0]?.revenue || 0;
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    return {
      today: {
        orders: todayStats[0]?.orders || 0,
        revenue: todayStats[0]?.revenue || 0
      },
      thisMonth: {
        orders: thisMonthStats[0]?.orders || 0,
        revenue: currentMonthRevenue
      },
      lastMonth: {
        orders: lastMonthStats[0]?.orders || 0,
        revenue: lastMonthRevenue
      },
      growth: {
        revenue: Math.round(revenueGrowth * 10) / 10
      }
    };
  } catch (error) {
    console.error('❌ Error in getAdminSalesAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch sales analytics');
  }
};

// ============================================
// ADMIN: Product Analytics
// ============================================
export const getAdminProductAnalytics = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const draftProducts = await Product.countDocuments({ status: 'draft' });
    const inactiveProducts = await Product.countDocuments({ status: 'inactive' });

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'completed'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    const topProductsWithDetails = await Product.populate(topProducts, {
      path: '_id',
      select: 'title images price'
    });

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 },
      status: 'active'
    });

    // Out of stock
    const outOfStock = await Product.countDocuments({
      stock: 0,
      status: 'active'
    });

    return {
      summary: {
        totalProducts,
        activeProducts,
        draftProducts,
        inactiveProducts,
        lowStockProducts,
        outOfStock
      },
      topProducts: topProductsWithDetails
    };
  } catch (error) {
    console.error('❌ Error in getAdminProductAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch product analytics');
  }
};

// ============================================
// ADMIN: Order Analytics
// ============================================
export const getAdminOrderAnalytics = async () => {
  try {
    const totalOrders = await Order.countDocuments();

    // Status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Recent trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTrend = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    return {
      summary: { totalOrders },
      statusBreakdown,
      paymentBreakdown,
      recentTrend
    };
  } catch (error) {
    console.error('❌ Error in getAdminOrderAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch order analytics');
  }
};

// ============================================
// ADMIN: Commission Analytics
// ============================================
export const getAdminCommissionAnalytics = async () => {
  try {
    const { Commission } = await import('../models/Commission.js');
    
    const totalCommission = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }
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

    // Monthly trend
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
      summary: {
        totalCommission: totalCommission[0]?.total || 0,
        totalTransactions: totalCommission[0]?.count || 0
      },
      statusBreakdown,
      monthlyTrend
    };
  } catch (error) {
    console.error('❌ Error in getAdminCommissionAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch commission analytics');
  }
};

// ============================================
// ADMIN: Subscription Analytics
// ============================================
export const getAdminSubscriptionAnalytics = async () => {
  try {
    const { Subscription } = await import('../models/Subscription.js');
    
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    // Plan breakdown
    const planBreakdown = await Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      }
    ]);

    // MRR (Monthly Recurring Revenue)
    const mrrData = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, mrr: { $sum: '$amount' } } }
    ]);

    return {
      summary: {
        totalSubscriptions,
        activeSubscriptions,
        mrr: mrrData[0]?.mrr || 0
      },
      planBreakdown
    };
  } catch (error) {
    console.error('❌ Error in getAdminSubscriptionAnalytics:', error);
    throw new ApiError(500, 'Failed to fetch subscription analytics');
  }
};