import { Store } from '../models/Store.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllStores = async (query, userId, userRole) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (userRole === 'vendor') {
    filter.vendor = userId;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    filter.status = status;
  }

  const stores = await Store.find(filter)
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalStores = await Store.countDocuments(filter);

  return {
    stores,
    totalPages: Math.ceil(totalStores / limit),
    currentPage: Number(page),
    totalStores
  };
};



export const createStore = async (storeData, vendorId) => {
  console.log('🔧 Service: Creating store with:', { storeData, vendorId });
  
  // ✅ Validation
  if (!storeData.name || !storeData.name.trim()) {
    throw new ApiError(400, 'Store name is required');
  }

  // Auto-generate slug if not provided
  let slug = storeData.slug;
  if (!slug) {
    slug = storeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Check if slug already exists
  const existingStore = await Store.findOne({ slug });
  if (existingStore) {
    // If slug exists, append a number
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (await Store.findOne({ slug: newSlug })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    slug = newSlug;
    console.log('⚠️ Slug already exists, using:', slug);
  }

  try {
    const store = await Store.create({
      name: storeData.name.trim(),
      slug: slug,
      description: storeData.description?.trim() || '',
      vendor: vendorId,
      status: storeData.status || 'active',
      settings: storeData.settings || {
        currency: 'INR',
        returnPolicy: '7 days return policy'
      }
    });

    console.log('✅ Store created successfully:', store._id);
    return store;
  } catch (error) {
    console.error('❌ Database error creating store:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ApiError(409, 'Store with this name or slug already exists');
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, messages.join(', '));
    }
    
    throw error;
  }
};

export const updateStore = async (storeId, updateData, userId, userRole) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (userRole === 'vendor' && store.vendor.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to update this store');
  }

  Object.assign(store, updateData);
  await store.save();
  return store;
};

export const deleteStore = async (storeId, userId, userRole) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (userRole === 'vendor' && store.vendor.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to delete this store');
  }

  await Store.findByIdAndDelete(storeId);
  return true;
};


// ===== PUBLIC: Get all active stores for customers =====
export const getPublicStores = async (query) => {
  const { page = 1, limit = 12, search } = query;
  const skip = (page - 1) * limit;
  
  const filter = { status: 'active' }; // Sirf active stores
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const stores = await Store.find(filter)
    .populate('vendor', 'name')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalStores = await Store.countDocuments(filter);

  return {
    stores,
    totalPages: Math.ceil(totalStores / limit),
    currentPage: Number(page),
    totalStores
  };
};

// ===== PUBLIC: Get single store details =====
export const getPublicStore = async (storeId) => {
  const store = await Store.findOne({ _id: storeId, status: 'active' })
    .populate('vendor', 'name email');
  
  if (!store) {
    throw new ApiError(404, 'Store not found or is no longer active');
  }
  return store;
};

// ===== PUBLIC: Get products from a specific store =====
export const getStoreProducts = async (storeId, query) => {
  const { page = 1, limit = 12 } = query;
  const skip = (page - 1) * limit;
  
  const filter = { 
    store: storeId, 
    status: 'active' // Sirf active products
  };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: Number(page),
    totalProducts
  };
};

// ============================================
// Get single store with stats
// ============================================
export const getStoreById = async (storeId) => {
  const store = await Store.findById(storeId)
    .populate('vendor', 'name email')
    .populate('category', 'name');
  
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  // Calculate stats
  const { Product } = await import('../models/Product.js');
  const { Order } = await import('../models/Order.js');

  const productCount = await Product.countDocuments({ store: storeId });
  const orderCount = await Order.countDocuments({ vendor: store.vendor });
  
  const revenueData = await Order.aggregate([
    { $match: { vendor: store.vendor, status: { $in: ['delivered', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  const customerCount = await Order.distinct('customer', { vendor: store.vendor });

  return {
    ...store.toObject(),
    productCount,
    orderCount,
    totalRevenue,
    customerCount: customerCount.length
  };
};

// ============================================
// Update store
// ============================================
export const updateStoreById = async (storeId, updateData) => {
  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  // If name changed, update slug
  if (updateData.name && updateData.name !== store.name) {
    let slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let existingStore = await Store.findOne({ slug, _id: { $ne: storeId } });
    if (existingStore) {
      let counter = 1;
      let newSlug = `${slug}-${counter}`;
      while (await Store.findOne({ slug: newSlug, _id: { $ne: storeId } })) {
        counter++;
        newSlug = `${slug}-${counter}`;
      }
      slug = newSlug;
    }
    updateData.slug = slug;
  }

  Object.assign(store, updateData);
  await store.save();
  return store;
};

// ============================================
// Store Analytics
// ============================================
export const getStoreAnalytics = async (storeId) => {
  const store = await Store.findById(storeId).populate('vendor', 'name');
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  const { Product } = await import('../models/Product.js');
  const { Order } = await import('../models/Order.js');
  const { Review } = await import('../models/Review.js');

  const vendorId = store.vendor._id || store.vendor;

  // Total stats
  const totalProducts = await Product.countDocuments({ store: storeId });
  const totalOrders = await Order.countDocuments({ vendor: vendorId });

  const revenueData = await Order.aggregate([
    { $match: { vendor: vendorId, status: { $in: ['delivered', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;
  const avgOrderValue = revenueData[0]?.count > 0 ? Math.round(totalRevenue / revenueData[0].count) : 0;

  // Avg rating
  const storeProducts = await Product.find({ store: storeId }).select('_id');
  const productIds = storeProducts.map(p => p._id);
  
  const ratingData = await Review.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  const avgRating = ratingData[0]?.avg || 0;

  // Monthly revenue trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { 
      $match: { 
        vendor: vendorId, 
        status: { $in: ['delivered', 'completed'] },
        createdAt: { $gte: sixMonthsAgo }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { month: '$_id', revenue: 1, _id: 0 } }
  ]);

  // Top selling products
  const topProducts = await Order.aggregate([
    { $match: { vendor: vendorId, status: { $in: ['delivered', 'completed'] } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        sold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);

  const topProductsWithDetails = await Product.populate(topProducts, {
    path: '_id',
    select: 'title'
  });

  const topProductsFormatted = topProductsWithDetails.map(p => ({
    title: p._id?.title || 'Unknown',
    sold: p.sold,
    revenue: p.revenue
  }));

  // Status breakdown
  const statusBreakdown = await Order.aggregate([
    { $match: { vendor: vendorId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Low stock products
  const lowStockProducts = await Product.find({
    store: storeId,
    stock: { $lte: 10 },
    status: 'active'
  }).select('title stock').limit(10);

  return {
    storeName: store.name,
    totalRevenue,
    totalOrders,
    totalProducts,
    avgOrderValue,
    avgRating,
    monthlyRevenue,
    topProducts: topProductsFormatted,
    statusBreakdown,
    lowStockProducts
  };
};