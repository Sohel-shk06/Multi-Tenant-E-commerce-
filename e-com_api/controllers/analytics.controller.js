import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as analyticsService from '../services/analytics.service.js';

export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getAdminDashboardStats();
  return res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

export const getRevenueChartData = asyncHandler(async (req, res) => {
  const { timeframe } = req.query;
  const chartData = await analyticsService.getRevenueChartData(timeframe);
  return res.status(200).json(new ApiResponse(200, chartData, 'Revenue chart data fetched successfully'));
});

export const getTopVendors = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const vendors = await analyticsService.getTopVendors(limit ? parseInt(limit) : 5);
  return res.status(200).json(new ApiResponse(200, vendors, 'Top vendors fetched successfully'));
});


export const getAdminRevenueAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminRevenueAnalytics(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Revenue analytics fetched successfully'));
});

export const getAdminVendorAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminVendorAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Vendor analytics fetched successfully'));
});

export const getAdminCustomerAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminCustomerAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Customer analytics fetched successfully'));
});

export const getAdminSalesAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminSalesAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Sales analytics fetched successfully'));
});

export const getAdminProductAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminProductAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Product analytics fetched successfully'));
});

export const getAdminOrderAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminOrderAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Order analytics fetched successfully'));
});

export const getAdminCommissionAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminCommissionAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Commission analytics fetched successfully'));
});

export const getAdminSubscriptionAnalytics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getAdminSubscriptionAnalytics();
  return res.status(200).json(new ApiResponse(200, result, 'Subscription analytics fetched successfully'));
});