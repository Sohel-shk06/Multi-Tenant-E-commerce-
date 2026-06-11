import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';


import { Store } from '../models/Store.js';

// ===== ADMIN: Vendor Management Functions =====

// Get all vendors with search and pagination
export const getAllVendors = async (query) => {
  const { search, page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  const filter = { role: 'vendor' };
  
  if (status) {
    filter.status = status;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const vendors = await User.find(filter)
    .select('-password -resetPasswordToken -verifyEmailToken')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalVendors = await User.countDocuments(filter);

  return {
    vendors,
    totalPages: Math.ceil(totalVendors / limit),
    currentPage: Number(page),
    totalVendors
  };
};

// Update vendor status (Active / Suspended)
export const updateVendorStatus = async (vendorId, status) => {
  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== 'vendor') {
    throw new ApiError(404, 'Vendor not found');
  }

  vendor.status = status;
  await vendor.save();
  
  return vendor;
};

// Admin creates a new vendor manually
export const createVendorByAdmin = async (vendorData) => {
  const { name, email, password, storeName } = vendorData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const newVendor = await User.create({
    name,
    email,
    password,
    role: 'vendor',
    status: 'active',
    isVerified: true
  });

  return newVendor;
};

// ===== VENDOR: Dashboard Functions =====

// Get Vendor Dashboard Stats
export const getVendorStats = async (vendorId) => {
  const totalProducts = await Product.countDocuments({ vendor: vendorId });
  const totalOrders = await Order.countDocuments({ vendor: vendorId });
  
  const revenueData = await Order.aggregate([
    { $match: { vendor: vendorId, status: { $in: ['completed', 'delivered'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  const lowStockProducts = await Product.countDocuments({ vendor: vendorId, stock: { $lt: 10 } });

  return { totalProducts, totalOrders, totalRevenue, lowStockProducts };
};

// Get Vendor Revenue Chart Data
export const getVendorRevenueChart = async (vendorId) => {
  const revenueData = await Order.aggregate([
    { $match: { vendor: vendorId, status: { $in: ['completed', 'delivered'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id': 1 } },
    { $project: { name: '$_id', revenue: 1, _id: 0 } }
  ]);

  // Agar data nahi hai, toh dummy data return karein
  if (revenueData.length === 0) {
    return [
      { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 },
      { name: 'Apr', revenue: 0 }, { name: 'May', revenue: 0 }, { name: 'Jun', revenue: 0 }
    ];
  }
  return revenueData;
};

// Get Vendor Recent Orders
export const getVendorRecentOrders = async (vendorId) => {
  return await Order.find({ vendor: vendorId })
    .populate('customer', 'name email')
    .populate('items.product', 'title')
    .sort({ createdAt: -1 })
    .limit(5);
};


// ===== VENDOR: Product Management Functions =====

// Get vendor's own products
export const getVendorProducts = async (vendorId, query) => {
  console.log('🔧 Service: Fetching products for vendor:', vendorId);
  
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;
  
  const filter = { vendor: vendorId };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status) filter.status = status;

  console.log('🔧 Filter:', filter);

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate('store', 'name')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  console.log('✅ Found', products.length, 'products out of', totalProducts);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: Number(page),
    totalProducts
  };
};

// Get single product (vendor's own)
export const getVendorProduct = async (vendorId, productId) => {
  const product = await Product.findOne({ _id: productId, vendor: vendorId })
    .populate('category', 'name slug')
    .populate('store', 'name');
  
  if (!product) {
    throw new ApiError(404, 'Product not found or you are not authorized');
  }
  return product;
};

export const createVendorProduct = async (vendorId, productData) => {
  console.log('🔧 Service: Creating product with:', { vendorId, productData });
  
  const { title, description, price, comparePrice, category, store, variants, tags, stock, sku } = productData;

  // ✅ Detailed Validation
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Product title is required');
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, 'Product description is required');
  }
  if (!price || price <= 0) {
    throw new ApiError(400, 'Valid price is required');
  }
  if (!category) {
    throw new ApiError(400, 'Category is required');
  }
  if (!store) {
    throw new ApiError(400, 'Store is required');
  }

  // ✅ Validate store belongs to vendor
  const { Store } = await import('../models/Store.js');
  const vendorStore = await Store.findOne({ _id: store, vendor: vendorId });
  
  if (!vendorStore) {
    console.error('❌ Store validation failed:', { store, vendorId });
    throw new ApiError(400, 'Invalid store. Please select one of your stores.');
  }

  // ✅ Validate category exists
  const { Category } = await import('../models/Category.js');
  const validCategory = await Category.findById(category);
  if (!validCategory) {
    console.error('❌ Category validation failed:', { category });
    throw new ApiError(400, 'Invalid category selected');
  }

  try {
    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price,
      comparePrice: comparePrice || 0,
      category,
      vendor: vendorId,
      store: store,
      variants: variants || [],
      tags: tags || [],
      stock: stock || 0,
      sku: sku || undefined,
      status: 'draft'
    });

    console.log('✅ Product created successfully:', product._id);
    return product;
  } catch (error) {
    console.error('❌ Database error creating product:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new ApiError(409, `Product with this ${field} already exists`);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, messages.join(', '));
    }
    
    throw error;
  }
};

// Update vendor's product
export const updateVendorProduct = async (vendorId, productId, updateData) => {
  const product = await Product.findOne({ _id: productId, vendor: vendorId });
  if (!product) {
    throw new ApiError(404, 'Product not found or you are not authorized');
  }

  // If store is being changed, validate it
  if (updateData.store && updateData.store !== product.store.toString()) {
    const { Store } = await import('../models/Store.js');
    const vendorStore = await Store.findOne({ _id: updateData.store, vendor: vendorId });
    if (!vendorStore) {
      throw new ApiError(400, 'Invalid store selection');
    }
  }

  Object.assign(product, updateData);
  await product.save();
  return product;
};

// Delete vendor's product
export const deleteVendorProduct = async (vendorId, productId) => {
  const product = await Product.findOneAndDelete({ _id: productId, vendor: vendorId });
  if (!product) {
    throw new ApiError(404, 'Product not found or you are not authorized');
  }
  return true;
};







// Get vendor's all stores (with pagination)
export const getVendorStores = async (vendorId, query = {}) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;
  
  const filter = { vendor: vendorId };
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }

  const stores = await Store.find(filter)
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

// Get vendor's stores (simple list for dropdown)
export const getVendorStoresSimple = async (vendorId) => {
  return await Store.find({ vendor: vendorId }).select('name slug');
};

// Get single store
export const getVendorStoreById = async (vendorId, storeId) => {
  const store = await Store.findOne({ _id: storeId, vendor: vendorId });
  if (!store) {
    throw new ApiError(404, 'Store not found or you are not authorized');
  }
  return store;
};

// Create store
export const createVendorStore = async (vendorId, storeData) => {
  const { name, description, settings } = storeData;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Store name is required');
  }

  // Auto-generate slug
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Check if slug exists
  let existingStore = await Store.findOne({ slug });
  if (existingStore) {
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (await Store.findOne({ slug: newSlug })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    slug = newSlug;
  }

  const store = await Store.create({
    name: name.trim(),
    slug,
    description: description?.trim() || '',
    vendor: vendorId,
    status: 'active',
    settings: settings || {
      currency: 'INR',
      returnPolicy: '7 days return policy'
    }
  });

  return store;
};

// Update store
export const updateVendorStore = async (vendorId, storeId, updateData) => {
  const store = await Store.findOne({ _id: storeId, vendor: vendorId });
  if (!store) {
    throw new ApiError(404, 'Store not found or you are not authorized');
  }

  // If name is being changed, update slug
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

// Delete store
export const deleteVendorStore = async (vendorId, storeId) => {
  const store = await Store.findOne({ _id: storeId, vendor: vendorId });
  if (!store) {
    throw new ApiError(404, 'Store not found or you are not authorized');
  }

  // Check if store has products
  const { Product } = await import('../models/Product.js');
  const productCount = await Product.countDocuments({ store: storeId });
  if (productCount > 0) {
    throw new ApiError(400, `Cannot delete store. It has ${productCount} product(s). Please delete or move them first.`);
  }

  await Store.findByIdAndDelete(storeId);
  return true;
};


// ===== VENDOR: Order Management Functions =====

export const getVendorOrders = async (vendorId, query) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;
  
  const filter = { vendor: vendorId };
  
  if (search) {
    filter.orderNumber = { $regex: search, $options: 'i' };
  }
  if (status) {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .populate('customer', 'name email')
    .populate('items.product', 'title images')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalOrders = await Order.countDocuments(filter);

  return {
    orders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: Number(page),
    totalOrders
  };
};

export const getVendorOrderById = async (vendorId, orderId) => {
  const order = await Order.findOne({ _id: orderId, vendor: vendorId })
    .populate('customer', 'name email')
    .populate('items.product', 'title images');
  
  if (!order) {
    throw new ApiError(404, 'Order not found or you are not authorized');
  }
  return order;
};

export const updateVendorOrderStatus = async (vendorId, orderId, newStatus) => {
  const order = await Order.findOne({ _id: orderId, vendor: vendorId });
  if (!order) {
    throw new ApiError(404, 'Order not found or you are not authorized');
  }

  // Valid status transitions
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': ['completed'],
    'completed': [],
    'cancelled': []
  };

  if (!validTransitions[order.status]?.includes(newStatus)) {
    throw new ApiError(400, `Cannot change status from ${order.status} to ${newStatus}`);
  }

  order.status = newStatus;

  // Update timestamps based on status
  if (newStatus === 'cancelled') order.cancelledAt = new Date();
  else if (newStatus === 'delivered') order.deliveredAt = new Date();
  else if (newStatus === 'completed') order.completedAt = new Date();

  await order.save();
  return order;
};