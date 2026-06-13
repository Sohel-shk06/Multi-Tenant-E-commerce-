import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

// Get all orders with filters
export const getAllOrders = async (query, userId, userRole) => {
  const { 
    page = 1, 
    limit = 10, 
    status,
    search
  } = query;
  
  const skip = (page - 1) * limit;
  const filter = {};

  // Role-based filtering
  if (userRole === 'vendor') {
    filter.vendor = userId;
  } else if (userRole === 'customer') {
    filter.customer = userId;
  }

  // Status filter
  if (status) filter.status = status;

  // Search by order number
  if (search) {
    filter.orderNumber = { $regex: search, $options: 'i' };
  }

  const orders = await Order.find(filter)
    .populate('customer', 'name email')
    .populate('vendor', 'name email')
    .populate('store', 'name')
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

// Get single order by ID
// Get single order by ID
export const getOrderById = async (orderId, userId, userRole) => {
  const order = await Order.findById(orderId)
    .populate('customer', 'name email')
    .populate('vendor', 'name email')
    .populate('store', 'name slug')
    .populate('items.product', 'title images');
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // ✅ FIX: Convert userId to string for proper comparison
  const userIdStr = userId.toString();

  console.log('🔍 Order authorization check:', {
    userRole,
    userId: userIdStr,
    orderCustomerId: order.customer?._id?.toString(),
    orderVendorId: order.vendor?._id?.toString()
  });

  // Authorization check - Admin can view any order
  if (userRole === 'admin') {
    return order;
  }

  // Vendor can only view their own orders
  if (userRole === 'vendor') {
    if (!order.vendor || order.vendor._id.toString() !== userIdStr) {
      throw new ApiError(403, 'You are not authorized to view this order');
    }
  }

  // Customer can only view their own orders
  if (userRole === 'customer') {
    if (!order.customer || order.customer._id.toString() !== userIdStr) {
      throw new ApiError(403, 'You are not authorized to view this order');
    }
  }

  return order;
};

// Update order status
export const updateOrderStatus = async (orderId, status, userId, userRole) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Authorization check
  if (userRole === 'vendor' && order.vendor.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to update this order');
  }

  // Status transition validation
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': ['completed'],
    'completed': [],
    'cancelled': []
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
  }

  order.status = status;

  // Set timestamps based on status
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
  } else if (status === 'delivered') {
    order.deliveredAt = new Date();
  } else if (status === 'completed') {
    order.completedAt = new Date();
  }

  await order.save();

  return order;
};




// Create order
export const createOrder = async (orderData) => {
  console.log('📥 Creating order with data:', JSON.stringify(orderData, null, 2));
  
  const { customer, vendor, store, items, shippingAddress, paymentMethod } = orderData;

  // Validations
  if (!customer) throw new ApiError(400, 'Customer information is required');
  if (!store) throw new ApiError(400, 'Store information is required');
  if (!items || items.length === 0) throw new ApiError(400, 'Order must have at least one item');

  // ✅ FIX 1: Vendor fetch karo store se agar nahi mila
  let vendorId = vendor;
  if (!vendorId) {
    try {
      const { Store } = await import('../models/Store.js');
      const storeData = await Store.findById(store);
      if (storeData && storeData.vendor) {
        vendorId = storeData.vendor;
        console.log('✅ Vendor auto-fetched from store:', vendorId);
      } else {
        console.error('❌ Store not found or vendor missing:', storeData);
      }
    } catch (err) {
      console.error('❌ Error fetching store:', err);
    }
  }

  if (!vendorId) {
    throw new ApiError(400, 'Vendor information required (directly or via store)');
  }

  // ✅ FIX 2: Items process karo aur totals calculate karo
  let subtotal = 0;
  const enrichedItems = [];
  
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.title}. Available: ${product.stock}`);
    }
    
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    enrichedItems.push({
      product: item.product,
      title: product.title,
      price: product.price,
      quantity: item.quantity
    });
  }

  const tax = subtotal * 0.18;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const totalAmount = subtotal + tax + shippingCost;

  console.log('📝 Order calculation:', { subtotal, tax, shippingCost, totalAmount });

  // ✅ FIX 3: Order create - orderNumber auto-generate hoga pre-save hook se
  try {
    const order = await Order.create({
      customer,
      vendor: vendorId,
      store,
      items: enrichedItems,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending'
    });

    console.log('✅ Order created:', order._id, 'Number:', order.orderNumber);

    // ✅ Stock reduce karo
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    return order;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, `Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
};