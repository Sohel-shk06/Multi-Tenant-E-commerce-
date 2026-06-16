import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as reviewService from '../services/review.service.js';

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, review, 'Review submitted successfully'));
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getProductReviews(req.params.productId, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Reviews fetched successfully'));
});

export const getCustomerReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getCustomerReviews(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Customer reviews fetched successfully'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.user._id, req.params.reviewId, req.body);
  return res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.user._id, req.params.reviewId);
  return res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
});

export const markHelpful = asyncHandler(async (req, res) => {
  const review = await reviewService.markHelpful(req.params.reviewId);
  return res.status(200).json(new ApiResponse(200, review, 'Review marked as helpful'));
});

export const getReviewableProducts = asyncHandler(async (req, res) => {
  const products = await reviewService.getReviewableProducts(req.user._id);
  return res.status(200).json(new ApiResponse(200, products, 'Reviewable products fetched successfully'));
});