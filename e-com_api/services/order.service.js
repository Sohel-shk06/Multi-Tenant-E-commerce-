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
export const getOrderById = async (orderId, userId, userRole) => {
  const order = await Order.findById(orderId)
    .populate('customer', 'name email')
    .populate('vendor', 'name email')
    .populate('store', 'name')
    .populate('items.product', 'title images');
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Authorization check
  if (userRole === 'vendor' && order.vendor._id.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to view this order');
  }
  if (userRole === 'customer' && order.customer._id.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to view this order');
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




// Create order (for testing - normally created after payment)
export const createOrder = async (orderData) => {
  const { customer, vendor, store, items, shippingAddress, paymentMethod } = orderData;

  // ✅ FIX: Agar vendor nahi mila, toh store se fetch karo
  let vendorId = vendor;
  if (!vendorId && store) {
    const { Store } = await import('../models/Store.js');
    const storeData = await Store.findById(store);
    if (storeData) {
      vendorId = storeData.vendor;
      console.log('✅ Vendor auto-fetched from store:', vendorId);
    }
  }

  if (!vendorId) {
    throw new ApiError(400, 'Vendor information is required');
  }

  // ✅ FIX: Calculate totals from items
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

  const tax = subtotal * 0.18; // 18% GST
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
  const totalAmount = subtotal + tax + shippingCost;

  // ✅ FIX: Generate unique order number
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const orderNumber = `ORD-${dateStr}-${random}`;

  console.log('📝 Creating order:', {
    orderNumber,
    customer,
    vendor: vendorId,
    store,
    items: enrichedItems.length,
    totalAmount
  });

  const order = await Order.create({
    orderNumber,
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

  // ✅ Reduce stock for each product
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  console.log('✅ Order created successfully:', order._id);
  return order;
};