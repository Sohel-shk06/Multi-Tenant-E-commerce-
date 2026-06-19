import mongoose from 'mongoose'; 
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { Payment } from '../models/Payment.js';
import { Payout } from '../models/Payout.js'
import { Review } from '../models/Review.js';



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

// ✅ UPDATED: Smart image update - existing images preserve karega
export const updateVendorProduct = async (vendorId, productId, updateData) => {
  const product = await Product.findOne({ _id: productId, vendor: vendorId });
  if (!product) {
    throw new ApiError(404, 'Product not found or you are not authorized');
  }

  // Store validation agar change ho raha hai
  if (updateData.store && updateData.store !== product.store.toString()) {
    const { Store } = await import('../models/Store.js');
    const vendorStore = await Store.findOne({ _id: updateData.store, vendor: vendorId });
    if (!vendorStore) {
      throw new ApiError(400, 'Invalid store selection');
    }
  }

  // ✅ Parse existingImages (jo vendor ne rakhi hain)
  let existingImages = [];
  if (updateData.existingImages) {
    try {
      existingImages = typeof updateData.existingImages === 'string' 
        ? JSON.parse(updateData.existingImages) 
        : updateData.existingImages;
    } catch (e) {
      console.warn('⚠️  Failed to parse existingImages:', e.message);
      existingImages = [];
    }
  }

  // ✅ Parse variants agar JSON string hai
  if (updateData.variants && typeof updateData.variants === 'string') {
    try {
      updateData.variants = JSON.parse(updateData.variants);
    } catch (e) {
      delete updateData.variants;
    }
  }

  // ✅ Parse tags agar string hai
  if (updateData.tags && typeof updateData.tags === 'string') {
    updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  // ✅ Number fields convert
  if (updateData.price) updateData.price = Number(updateData.price);
  if (updateData.comparePrice) updateData.comparePrice = Number(updateData.comparePrice);
  if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

  // ✅ SMART IMAGE HANDLING
  if (product.images && product.images.length > 0) {
    const existingPublicIds = existingImages.map(img => img.publicId).filter(Boolean);
    
    // Woh images dhundho jo vendor ne remove ki hain
    const imagesToDelete = product.images.filter(
      oldImg => !existingPublicIds.includes(oldImg.publicId)
    );

    // ✅ Sirf woh images delete karo jo vendor ne remove ki hain
    if (imagesToDelete.length > 0) {
      try {
        const { deleteFromCloudinary } = await import('../utils/cloudinaryUploader.js');
        for (const img of imagesToDelete) {
          if (img.publicId) {
            await deleteFromCloudinary(img.publicId);
            console.log('✅ Deleted old image from Cloudinary:', img.publicId);
          }
        }
      } catch (error) {
        console.warn('⚠️  Failed to delete some old images:', error.message);
      }
    }
  }

  // ✅ Naye images ko Cloudinary par upload karo (agar hain)
  let newUploadedImages = [];
  if (updateData.images && updateData.images.length > 0) {
    try {
      const { uploadMultipleToCloudinary } = await import('../utils/cloudinaryUploader.js');
      const uploaded = await uploadMultipleToCloudinary(updateData.images, 'products');
      newUploadedImages = uploaded.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        isPrimary: existingImages.length === 0 && index === 0 // Agar koi existing nahi hai toh pehli naye image primary
      }));
      console.log(`✅ ${newUploadedImages.length} new images uploaded to Cloudinary`);
    } catch (error) {
      console.error('❌ Failed to upload new images:', error.message);
      throw new ApiError(500, 'Failed to upload new images');
    }
  }

  // ✅ Final images array: existing + new
  const finalImages = [...existingImages, ...newUploadedImages];
  
  // Agar koi image hai toh pehli ko primary banao
  if (finalImages.length > 0 && !finalImages.some(img => img.isPrimary)) {
    finalImages[0].isPrimary = true;
  }

  // ✅ Update data mein images set karo
  updateData.images = finalImages;

  // ✅ Product update karo
  Object.assign(product, updateData);
  await product.save();
  
  console.log('✅ Product updated with images:', {
    existing: existingImages.length,
    new: newUploadedImages.length,
    total: finalImages.length
  });
  
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
  console.log('\n🔍 ========== UPDATE ORDER STATUS DEBUG ==========');
  console.log('🔍 Input:', { vendorId, orderId, newStatus });
  
  const order = await Order.findOne({ _id: orderId, vendor: vendorId });
  if (!order) {
    throw new ApiError(404, 'Order not found or you are not authorized');
  }

  console.log('🔍 Order found:', {
    orderId: order._id.toString(),
    currentStatus: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus
  });

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
  console.log('✅ Order status updated to:', newStatus);

  // 🎯 ✅ ROBUST PAYMENT UPDATE - HAR CASE MEIN KAAM KAREGA
  try {
    console.log('\n🔍 ========== PAYMENT UPDATE START ==========');
    
    // ✅ Pehle Payment document dhundhein (multiple ways try karein)
    const orderIdString = order._id.toString();
    console.log('🔍 Searching payment for order ID:', orderIdString);
    
    let payment = await Payment.findOne({ order: order._id });
    
    if (!payment) {
      console.log('⚠️  Payment not found with ObjectId, trying with string...');
      payment = await Payment.findOne({ order: orderIdString });
    }
    
    if (!payment) {
      console.log('⚠️  Payment still not found, trying with new ObjectId...');
      payment = await Payment.findOne({ order: new mongoose.Types.ObjectId(orderIdString) });
    }
    
    console.log('🔍 Payment found:', payment ? 'YES ✅' : 'NO ❌');
    
    if (payment) {
      console.log('🔍 Current payment status:', payment.paymentStatus);
      console.log('🔍 Order paymentMethod:', order.paymentMethod);
      console.log('🔍 Order paymentStatus:', order.paymentStatus);
      
      // ✅ CASE 1: Order delivered/completed ho gaya hai
      if (newStatus === 'delivered' || newStatus === 'completed') {
        
        // COD payment ko "paid" mark karein
        const isCOD = order.paymentMethod === 'cod' || order.paymentMethod === 'COD';
        const isPending = payment.paymentStatus === 'pending' || order.paymentStatus === 'pending';
        
        console.log('🔍 Is COD?', isCOD, '| Is Pending?', isPending);
        
        if (isCOD && isPending) {
          console.log('🔍 ✅ Updating payment to PAID...');
          
          payment.paymentStatus = 'paid';
          payment.paidAt = new Date();
          payment.gatewayResponse = {
            source: 'cod-delivery',
            note: 'Payment collected on delivery',
            updatedBy: vendorId,
            updatedAt: new Date()
          };
          
          await payment.save();
          console.log('✅✅✅ Payment saved with status: PAID');
          
          // Order ka paymentStatus bhi update karein
          order.paymentStatus = 'paid';
          await order.save();
          console.log('✅✅✅ Order paymentStatus updated to: PAID');
        } else {
          console.log('🔍 Skipping - not COD or already paid');
        }
      }
      
      // ✅ CASE 2: Order cancel ho gaya hai aur payment paid hai
      else if (newStatus === 'cancelled' && payment.paymentStatus === 'paid') {
        console.log('🔍 ✅ Updating payment to REFUNDED...');
        
        payment.paymentStatus = 'refunded';
        payment.gatewayResponse = {
          source: 'order-cancelled',
          note: 'Order cancelled, payment refunded',
          updatedBy: vendorId,
          updatedAt: new Date()
        };
        
        await payment.save();
        console.log('✅✅✅ Payment saved with status: REFUNDED');
        
        order.paymentStatus = 'refunded';
        await order.save();
        console.log('✅✅✅ Order paymentStatus updated to: REFUNDED');
      }
    } else {
      console.warn('⚠️  No Payment document found for this order!');
      console.warn('⚠️  Creating new Payment document...');
      
      // Agar Payment document hi nahi hai, toh create kar dein
      const newPayment = await Payment.create({
        order: order._id,
        customer: order.customer,
        vendor: order.vendor,
        transactionId: `TXN-${order._id.toString().slice(-8)}-${Date.now()}`,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod || 'cod',
        paymentStatus: (newStatus === 'delivered' || newStatus === 'completed') ? 'paid' : 'pending',
        paidAt: (newStatus === 'delivered' || newStatus === 'completed') ? new Date() : null
      });
      
      console.log('✅ New Payment document created:', newPayment._id);
      
      if (newStatus === 'delivered' || newStatus === 'completed') {
        order.paymentStatus = 'paid';
        await order.save();
        console.log('✅ Order paymentStatus updated to: PAID');
      }
    }
    
    console.log('🔍 ========== PAYMENT UPDATE END ==========\n');
  } catch (paymentError) {
    console.error('❌ ERROR in payment update:', paymentError.message);
    console.error('❌ Stack:', paymentError.stack);
  }

  console.log('🔍 ========== END DEBUG ==========\n');
  return order;
};


const PLATFORM_COMMISSION_RATE = 0.10; // 10% platform fee

export const getVendorEarningsOverview = async (vendorId) => {
  try {
    // 1. Calculate Total Revenue from completed/delivered orders
    const revenueData = await Order.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // 2. Calculate Commission and Net Earnings (10% platform fee)
    const platformCommission = totalRevenue * 0.10;
    const netEarnings = totalRevenue - platformCommission;

    // 3. Calculate Total Processed Payouts
    const payoutData = await Payout.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: 'processed' } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' } } }
    ]);
    const totalPaid = payoutData[0]?.totalPaid || 0;

    // 4. Calculate Pending Payouts
    const pendingPayoutData = await Payout.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: 'pending' } },
      { $group: { _id: null, totalPending: { $sum: '$amount' } } }
    ]);
    const totalPending = pendingPayoutData[0]?.totalPending || 0;

    // 5. Available Balance
    const availableBalance = netEarnings - totalPaid - totalPending;

    return {
      totalRevenue: totalRevenue || 0,
      platformCommission: platformCommission || 0,
      netEarnings: netEarnings || 0,
      totalPaid: totalPaid || 0,
      totalPending: totalPending || 0,
      availableBalance: Math.max(0, availableBalance) || 0
    };
  } catch (error) {
    console.error('❌ Error in getVendorEarningsOverview:', error);
    throw new ApiError(500, 'Failed to calculate earnings overview');
  }
};

export const getVendorPayoutHistory = async (vendorId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const payouts = await Payout.find({ vendor: vendorId })
    .skip(skip)
    .limit(Number(limit))
    .sort({ requestedAt: -1 });

  const totalPayouts = await Payout.countDocuments({ vendor: vendorId });

  return {
    payouts,
    totalPages: Math.ceil(totalPayouts / limit),
    currentPage: Number(page),
    totalPayouts
  };
};

export const requestVendorPayout = async (vendorId, amount) => {
  if (amount <= 0) {
    throw new ApiError(400, 'Invalid payout amount');
  }

  const overview = await getVendorEarningsOverview(vendorId);
  
  if (amount > overview.availableBalance) {
    throw new ApiError(400, `Insufficient balance. Available: ₹${overview.availableBalance.toFixed(2)}`);
  }

  const payout = await Payout.create({
    vendor: vendorId,
    amount: amount,
    status: 'pending'
  });

  return payout;
};

export const getVendorMonthlyEarnings = async (vendorId) => {
  const monthlyData = await Order.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: { $in: ['delivered', 'completed'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id': 1 } },
    { $project: { month: '$_id', revenue: 1, _id: 0 } }
  ]);

  // Fill missing months with 0 for the last 6 months (optional but good for charts)
  return monthlyData;
};





// Get all reviews for vendor's products
export const getVendorReviews = async (vendorId, query) => {
  const { page = 1, limit = 10, rating, sort = 'recent' } = query;
  const skip = (page - 1) * limit;

  // First, find all products of this vendor
  const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
  const productIds = vendorProducts.map(p => p._id);

  const filter = { product: { $in: productIds } };
  
  if (rating) filter.rating = Number(rating);

  // Sort
  let sortOption = { createdAt: -1 };
  if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
  if (sort === 'unreplied') {
    filter.vendorReply = { $exists: false };
    sortOption = { createdAt: -1 };
  }

  const reviews = await Review.find(filter)
    .populate('product', 'title images')
    .populate('customer', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  const totalReviews = await Review.countDocuments(filter);

  return {
    reviews,
    totalPages: Math.ceil(totalReviews / limit),
    currentPage: Number(page),
    totalReviews
  };
};

// Get single review (with authorization check)
export const getVendorReview = async (vendorId, reviewId) => {
  const review = await Review.findById(reviewId)
    .populate('product', 'title images')
    .populate('customer', 'name email')
    .populate('order', 'orderNumber');

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Check if this review is for vendor's product
  const product = await Product.findOne({ _id: review.product._id, vendor: vendorId });
  if (!product) {
    throw new ApiError(403, 'You are not authorized to view this review');
  }

  return review;
};

// Reply to a review
export const replyToReview = async (vendorId, reviewId, replyText) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Authorization check
  const product = await Product.findOne({ _id: review.product, vendor: vendorId });
  if (!product) {
    throw new ApiError(403, 'You are not authorized to reply to this review');
  }

  if (!replyText || !replyText.trim()) {
    throw new ApiError(400, 'Reply text is required');
  }

  review.vendorReply = replyText.trim();
  review.vendorReplyAt = new Date();
  await review.save();

  return review;
};

// Delete vendor reply
export const deleteVendorReply = async (vendorId, reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const product = await Product.findOne({ _id: review.product, vendor: vendorId });
  if (!product) {
    throw new ApiError(403, 'You are not authorized');
  }

  review.vendorReply = undefined;
  review.vendorReplyAt = undefined;
  await review.save();

  return review;
};

// Review Analytics for vendor
export const getVendorReviewAnalytics = async (vendorId) => {
  // Get all vendor products
  const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
  const productIds = vendorProducts.map(p => p._id);

  // Total reviews count
  const totalReviews = await Review.countDocuments({ product: { $in: productIds } });

  // Average rating
  const ratingData = await Review.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const avgRating = ratingData[0]?.avgRating || 0;

  // Rating distribution
  const distribution = await Review.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach(d => { ratingDistribution[d._id] = d.count; });

  // Replied vs Unreplied
  const repliedCount = await Review.countDocuments({ 
    product: { $in: productIds }, 
    vendorReply: { $exists: true, $ne: null } 
  });
  const unrepliedCount = totalReviews - repliedCount;

  // Most reviewed products
  const topProducts = await Review.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: '$product', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Populate product titles
  const topProductsWithDetails = await Product.populate(topProducts, {
    path: '_id',
    select: 'title images'
  });

  return {
    totalReviews,
    averageRating: Math.round(avgRating * 10) / 10,
    ratingDistribution,
    repliedCount,
    unrepliedCount,
    topProducts: topProductsWithDetails
  };
};





// Revenue Analytics (daily/monthly/yearly)
export const getVendorRevenueAnalytics = async (vendorId, query) => {
  const { period = 'monthly', startDate, endDate } = query;
  
  let dateFormat, groupFormat;
  if (period === 'daily') {
    dateFormat = '%Y-%m-%d';
    groupFormat = 'day';
  } else if (period === 'weekly') {
    dateFormat = '%Y-W%V';
    groupFormat = 'week';
  } else {
    dateFormat = '%Y-%m';
    groupFormat = 'month';
  }

  const matchStage = { vendor: new mongoose.Types.ObjectId(vendorId), status: { $in: ['delivered', 'completed'] } };
  
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

  // Calculate totals
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Growth calculation (compare with previous period)
  let growthRate = 0;
  if (revenueData.length >= 2) {
    const current = revenueData[revenueData.length - 1].revenue;
    const previous = revenueData[revenueData.length - 2].revenue;
    if (previous > 0) {
      growthRate = ((current - previous) / previous) * 100;
    }
  }

  return {
    data: revenueData.map(d => ({
      period: d._id,
      revenue: d.revenue,
      orders: d.orders,
      avgOrderValue: Math.round(d.avgOrderValue)
    })),
    summary: {
      totalRevenue,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue),
      growthRate: Math.round(growthRate * 10) / 10
    }
  };
};

// ✅ FIXED: Debug logs + Fallback + Data consistency check
export const getVendorProductAnalytics = async (vendorId) => {
  try {
    console.log('\n🔍 ========== PRODUCT ANALYTICS DEBUG ==========');
    console.log('👤 Vendor ID:', vendorId);

    // ============================================
    // STEP 1: Top selling products ki IDs nikalo
    // ============================================
    const topProductsAgg = await Order.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: { $in: ['delivered', 'completed'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    console.log('📊 Step 1 - Found', topProductsAgg.length, 'product IDs from orders');
    
    if (topProductsAgg.length > 0) {
      console.log('📋 Product IDs:', topProductsAgg.map(p => p._id.toString()));
    }

    // ============================================
    // STEP 2: Product IDs se details fetch karo
    // ============================================
    let topProducts = [];
    
    if (topProductsAgg.length > 0) {
      // ✅ Type conversion - sab IDs ko ObjectId mein convert karo
      const productIds = topProductsAgg.map(p => {
        try {
          return new mongoose.Types.ObjectId(p._id);
        } catch (e) {
          console.warn('⚠️  Invalid product ID:', p._id);
          return null;
        }
      }).filter(Boolean);

      console.log('🔎 Step 2 - Searching', productIds.length, 'products...');

      // ✅ Products fetch karo - WITHOUT vendor filter (data inconsistency handle karne ke liye)
      const productsDetails = await Product.find({ 
        _id: { $in: productIds } 
      }).select('title images price stock vendor');
      
      console.log('✅ Found', productsDetails.length, 'products in database');

      // ✅ Debug: Check karo konsa product missing hai
      const foundIds = productsDetails.map(p => p._id.toString());
      const missingIds = productIds.filter(id => !foundIds.includes(id.toString()));
      
      if (missingIds.length > 0) {
        console.warn('⚠️  Missing products (deleted or inconsistent):', missingIds);
      }

      // ✅ Debug: Vendor mismatch check
      productsDetails.forEach(p => {
        if (p.vendor.toString() !== vendorId.toString()) {
          console.warn('⚠️  Vendor mismatch for product:', p.title, '- belongs to', p.vendor);
        }
      });

      // Map banao for quick lookup
      const productMap = {};
      productsDetails.forEach(p => {
        productMap[p._id.toString()] = p;
      });

      // Merge karo - aggregation data + product details
      topProducts = topProductsAgg.map(agg => {
        const product = productMap[agg._id.toString()];
        return {
          product: product ? {
            _id: product._id,
            title: product.title,
            images: product.images || [],
            price: product.price,
            stock: product.stock
          } : null,
          totalSold: agg.totalSold,
          totalRevenue: agg.totalRevenue,
          ordersCount: agg.ordersCount
        };
      });

      console.log('✅ Final top products:', topProducts.filter(p => p.product).length);
    }

    console.log('🔍 ========== END DEBUG ==========\n');

    // ============================================
    // Low stock products
    // ============================================
    const lowStockProducts = await Product.find({
      vendor: vendorId,
      stock: { $lte: 10 },
      status: 'active'
    }).select('title stock price').limit(10);

    // ============================================
    // Products without reviews
    // ============================================
    const productsWithoutReviews = await Product.find({
      vendor: vendorId,
      totalReviews: 0,
      status: 'active'
    }).select('title price').limit(10);

    // ============================================
    // Total product stats
    // ============================================
    const productStats = await Product.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          draftProducts: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          totalStock: { $sum: '$stock' },
          totalStockValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    return {
      topProducts: topProducts.filter(p => p.product !== null), // Sirf valid products
      lowStockProducts,
      productsWithoutReviews,
      stats: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        draftProducts: 0,
        totalStock: 0,
        totalStockValue: 0
      }
    };
  } catch (error) {
    console.error('❌ Error in getVendorProductAnalytics:', error);
    throw new ApiError(500, `Failed to fetch product analytics: ${error.message}`);
  }
};


// Order Analytics
export const getVendorOrderAnalytics = async (vendorId) => {
  // Status breakdown
  const statusBreakdown = await Order.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
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
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Recent orders trend (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTrend = await Order.aggregate([
    { 
      $match: { 
        vendor: new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: sevenDaysAgo }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // Total stats
  const totalStats = await Order.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        avgOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);

  return {
    statusBreakdown,
    paymentBreakdown,
    recentTrend,
    stats: totalStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 }
  };
};

// Customer Analytics
export const getVendorCustomerAnalytics = async (vendorId) => {
  // Total unique customers
  const uniqueCustomers = await Order.distinct('customer', { 
    vendor: new mongoose.Types.ObjectId(vendorId) 
  });
  const totalCustomers = uniqueCustomers.length;

  // Repeat customers (customers with more than 1 order)
  const customerOrderCounts = await Order.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: '$customer',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' }
      }
    }
  ]);

  const repeatCustomers = customerOrderCounts.filter(c => c.orderCount > 1).length;
  const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  // Top customers by spending
  const topCustomers = customerOrderCounts
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // Populate customer details
  const topCustomersWithDetails = await User.populate(topCustomers, {
    path: '_id',
    select: 'name email'
  });

  // Customer acquisition trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const acquisitionTrend = await Order.aggregate([
    { 
      $match: { 
        vendor: new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: sixMonthsAgo }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        newCustomers: { $addToSet: '$customer' }
      }
    },
    {
      $project: {
        period: '$_id',
        newCustomers: { $size: '$newCustomers' }
      }
    },
    { $sort: { period: 1 } }
  ]);

  return {
    totalCustomers,
    repeatCustomers,
    repeatRate: Math.round(repeatRate * 10) / 10,
    topCustomers: topCustomersWithDetails,
    acquisitionTrend
  };
};

// Overall Sales Analytics (combined overview)
export const getVendorSalesAnalytics = async (vendorId) => {
  // Today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = await Order.aggregate([
    { 
      $match: { 
        vendor: new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: today }
      } 
    },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  // This month stats
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStats = await Order.aggregate([
    { 
      $match: { 
        vendor: new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: thisMonth },
        status: { $in: ['delivered', 'completed'] }
      } 
    },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Last month stats (for comparison)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthStats = await Order.aggregate([
    { 
      $match: { 
        vendor: new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: lastMonth, $lt: thisMonth },
        status: { $in: ['delivered', 'completed'] }
      } 
    },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Calculate growth
  const currentMonthRevenue = monthStats[0]?.revenue || 0;
  const lastMonthRevenue = lastMonthStats[0]?.revenue || 0;
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  const currentMonthOrders = monthStats[0]?.orders || 0;
  const lastMonthOrders = lastMonthStats[0]?.orders || 0;
  const ordersGrowth = lastMonthOrders > 0 
    ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
    : 0;

  return {
    today: {
      orders: todayStats[0]?.orders || 0,
      revenue: todayStats[0]?.revenue || 0
    },
    thisMonth: {
      orders: currentMonthOrders,
      revenue: currentMonthRevenue
    },
    lastMonth: {
      orders: lastMonthOrders,
      revenue: lastMonthRevenue
    },
    growth: {
      revenue: Math.round(revenueGrowth * 10) / 10,
      orders: Math.round(ordersGrowth * 10) / 10
    }
  };
};