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