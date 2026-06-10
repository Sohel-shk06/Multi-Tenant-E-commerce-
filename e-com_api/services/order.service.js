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

  // Calculate totals
  let subtotal = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }
    item.price = product.price;
    item.title = product.title;
    subtotal += product.price * item.quantity;
  }

  const tax = subtotal * 0.18; // 18% GST
  const shippingCost = 50; // Flat shipping
  const totalAmount = subtotal + tax + shippingCost;

  const order = await Order.create({
    customer,
    vendor,
    store,
    items,
    subtotal,
    tax,
    shippingCost,
    totalAmount,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
  });

  // Reduce stock for each product
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  return order;
};