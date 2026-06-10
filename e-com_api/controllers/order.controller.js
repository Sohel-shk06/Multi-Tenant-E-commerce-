import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';

export const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, result, 'Orders fetched successfully'));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(
    req.params.orderId, 
    status, 
    req.user._id, 
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, order, `Order ${status} successfully`));
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  return res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});