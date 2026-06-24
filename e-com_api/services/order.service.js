import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { Payment } from '../models/Payment.js';
import * as notificationService from './notification.service.js'; 

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
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    // If paid, mark payment as refunded
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
      await Payment.findOneAndUpdate(
        { order: order._id },
        { paymentStatus: 'refunded' }
      );
    }

    // Update commission status if it exists
    try {
      const { Commission } = await import('../models/Commission.js');
      await Commission.findOneAndUpdate(
        { order: order._id },
        { status: 'refunded', notes: 'Order cancelled by vendor/admin' }
      );
    } catch (commErr) {
      console.error('Warning: Failed to update commission status:', commErr.message);
    }
  } else if (status === 'delivered') {
    order.deliveredAt = new Date();
  } else if (status === 'completed') {
    order.completedAt = new Date();
  }

  await order.save();

  // Send Notification to customer
  try {
    await notificationService.createNotification({
      userId: order.customer,
      title: 'Order Status Update',
      message: `Your order #${order.orderNumber} status has been updated to ${status}.`,
      type: 'order_update'
    });
  } catch (notifErr) {
    console.error('Warning: Failed to create order status update notification:', notifErr.message);
  }

  return order;
};

// Cancel order by customer
export const cancelOrder = async (orderId, reason, userId, userRole) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Authorization check - only the owner can cancel
  if (userRole === 'customer' && order.customer.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to cancel this order');
  }

  // Check if status is cancelable
  const cancelableStatuses = ['pending', 'confirmed'];
  if (!cancelableStatuses.includes(order.status)) {
    throw new ApiError(400, `Cannot cancel order with status ${order.status}`);
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = reason || '';

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  // If paid, mark payment as refunded
  if (order.paymentStatus === 'paid') {
    order.paymentStatus = 'refunded';
    await Payment.findOneAndUpdate(
      { order: order._id },
      { paymentStatus: 'refunded' }
    );
  }

  // Update commission status if it exists
  try {
    const { Commission } = await import('../models/Commission.js');
    await Commission.findOneAndUpdate(
      { order: order._id },
      { status: 'refunded', notes: `Order cancelled by customer. Reason: ${reason || 'N/A'}` }
    );
  } catch (commErr) {
    console.error('Warning: Failed to update commission status:', commErr.message);
  }

  await order.save();

  // Send Notification to customer and vendor
  try {
    // Notify customer
    await notificationService.createNotification({
      userId: order.customer,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been successfully cancelled.`,
      type: 'order_update'
    });

    // Notify vendor (if vendor is assigned)
    if (order.vendor) {
      await notificationService.createNotification({
        userId: order.vendor,
        title: 'Order Cancelled by Customer',
        message: `Customer cancelled order #${order.orderNumber}. Reason: ${reason || 'No reason provided'}.`,
        type: 'order_update'
      });
    }
  } catch (notifErr) {
    console.error('Warning: Failed to create order cancellation notifications:', notifErr.message);
  }

  return order;
};




// Create order
// Create order
export const createOrder = async (orderData) => {
  console.log('📥 Creating order with data:', JSON.stringify(orderData, null, 2));
  
  const { customer, vendor, store, items, shippingAddress, paymentMethod } = orderData;

  // Validations
  if (!customer) throw new ApiError(400, 'Customer information is required');
  if (!store) throw new ApiError(400, 'Store information is required');
  if (!items || items.length === 0) throw new ApiError(400, 'Order must have at least one item');

  // ✅ Vendor fetch karo store se agar nahi mila
  let vendorId = vendor;
  if (!vendorId) {
    try {
      const { Store } = await import('../models/Store.js');
      const storeData = await Store.findById(store);
      if (storeData && storeData.vendor) {
        vendorId = storeData.vendor;
        console.log('✅ Vendor auto-fetched from store:', vendorId);
      }
    } catch (err) {
      console.error('❌ Error fetching store:', err);
    }
  }

  if (!vendorId) {
    throw new ApiError(400, 'Vendor information required (directly or via store)');
  }

  // ✅ Items process karo aur totals calculate karo
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

  // ✅ Order create
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

    // 🎯 ✅ YEH NAYA CODE ADD KAREIN - Payment Entry Auto Create
    try {
      const isOnlinePayment = paymentMethod && paymentMethod !== 'cod';
      
      const payment = await Payment.create({
        order: order._id,
        customer: customer,
        vendor: vendorId,
        transactionId: `TXN-${order._id.toString().slice(-8)}-${Date.now()}`,
        amount: totalAmount,
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: isOnlinePayment ? 'paid' : 'pending',
        paidAt: isOnlinePayment ? new Date() : null,
        gatewayResponse: {
          source: 'auto-created-with-order',
          note: 'COD payment - will be marked paid on delivery'
        }
      });
      
      console.log('✅ Payment entry created:', payment._id, 'Status:', payment.paymentStatus);
    } catch (paymentError) {
      // Payment create fail ho toh bhi order chalega (non-critical)
      console.error('⚠️  Warning: Payment entry create nahi hui:', paymentError.message);
    }

    // ✅ Stock reduce karo
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // ✅ Commission Entry Create
    try {
      const { Commission } = await import('../models/Commission.js');
      
      const commissionRate = 0.10; // 10%
      const commissionAmount = Math.round(totalAmount * commissionRate * 100) / 100;
      const vendorAmount = Math.round((totalAmount - commissionAmount) * 100) / 100;
      
      await Commission.create({
        order: order._id,
        vendor: vendorId,
        orderAmount: totalAmount,
        commissionRate: commissionRate,
        commissionAmount: commissionAmount,
        vendorAmount: vendorAmount,
        status: 'pending'
      });
      
      console.log('✅ Commission entry created: ₹' + commissionAmount);
    } catch (commissionError) {
      console.error('⚠️  Commission entry create nahi hui:', commissionError.message);
    }

    // Send notifications to customer and vendor
    try {
      // Notify customer
      await notificationService.createNotification({
        userId: customer,
        title: 'Order Placed Successfully',
        message: `Your order #${order.orderNumber} has been placed successfully!`,
        type: 'order_update'
      });

      // Notify vendor
      await notificationService.createNotification({
        userId: vendorId,
        title: 'New Order Received',
        message: `You have received a new order #${order.orderNumber} for ₹${totalAmount}.`,
        type: 'order_update'
      });
    } catch (notifErr) {
      console.error('Warning: Failed to create order placement notifications:', notifErr.message);
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


