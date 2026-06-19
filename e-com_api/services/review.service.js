import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

// ===== Create Review =====
export const createReview = async (customerId, reviewData) => {
  const { product, order, rating, title, comment } = reviewData;

  // Validations
  if (!product || !order || !rating || !title || !comment) {
    throw new ApiError(400, 'All fields are required');
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5');
  }

  // Check if order belongs to customer
  const customerOrder = await Order.findOne({ 
    _id: order, 
    customer: customerId,
    status: { $in: ['delivered', 'completed'] }
  });

  if (!customerOrder) {
    throw new ApiError(403, 'You can only review products from your delivered orders');
  }

  // Check if product is in that order
  const orderItem = customerOrder.items.find(
    item => item.product.toString() === product
  );
  
  if (!orderItem) {
    throw new ApiError(400, 'This product is not in your order');
  }

  // Check if product exists and is active
  const productDoc = await Product.findById(product);
  if (!productDoc) {
    throw new ApiError(404, 'Product not found');
  }

  // Check if customer already reviewed this product
  const existingReview = await Review.findOne({ product, customer: customerId });
  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this product');
  }

  // Create review
  const review = await Review.create({
    product,
    customer: customerId,
    order,
    rating,
    title: title.trim(),
    comment: comment.trim(),
    isVerifiedPurchase: true
  });

  return review;
};

// ===== Get Reviews for a Product =====
export const getProductReviews = async (productId, query) => {
  const { page = 1, limit = 10, rating, sort = 'recent' } = query;
  const skip = (page - 1) * limit;

  const filter = { product: productId, status: 'approved' };
  
  if (rating) {
    filter.rating = Number(rating);
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: recent
  if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
  if (sort === 'helpful') sortOption = { helpfulCount: -1, createdAt: -1 };

  const reviews = await Review.find(filter)
    .populate('customer', 'name avatar')
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  const totalReviews = await Review.countDocuments(filter);

  // Rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingDistribution.forEach(r => {
    distribution[r._id] = r.count;
  });

  return {
    reviews,
    totalPages: Math.ceil(totalReviews / limit),
    currentPage: Number(page),
    totalReviews,
    ratingDistribution: distribution
  };
};

// ===== Get Customer's Reviews =====
export const getCustomerReviews = async (customerId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ customer: customerId })
    .populate('product', 'title images')
    .populate('customer', 'name')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalReviews = await Review.countDocuments({ customer: customerId });

  return {
    reviews,
    totalPages: Math.ceil(totalReviews / limit),
    currentPage: Number(page),
    totalReviews
  };
};

// ===== Update Review =====
export const updateReview = async (customerId, reviewId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, customer: customerId });
  if (!review) {
    throw new ApiError(404, 'Review not found or you are not authorized');
  }

  if (updateData.rating) review.rating = updateData.rating;
  if (updateData.title) review.title = updateData.title.trim();
  if (updateData.comment) review.comment = updateData.comment.trim();

  await review.save();
  return review;
};

// ===== Delete Review =====
export const deleteReview = async (customerId, reviewId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, customer: customerId });
  if (!review) {
    throw new ApiError(404, 'Review not found or you are not authorized');
  }
  return true;
};

// ===== Mark Review as Helpful =====
export const markHelpful = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }
  review.helpfulCount += 1;
  await review.save();
  return review;
};

// ===== Get Reviewable Products (from delivered orders) =====
export const getReviewableProducts = async (customerId) => {
  // Find all delivered/completed orders
  const orders = await Order.find({
    customer: customerId,
    status: { $in: ['delivered', 'completed'] }
  }).populate('items.product', 'title images');

  // Get all reviewed product IDs
  const reviewedProductIds = await Review.find({ customer: customerId }).distinct('product');
  const reviewedSet = new Set(reviewedProductIds.map(id => id.toString()));

  // Filter out already reviewed products
  const reviewableItems = [];
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!reviewedSet.has(item.product._id.toString())) {
        reviewableItems.push({
          order: order._id,
          product: item.product,
          orderNumber: order.orderNumber,
          deliveredAt: order.deliveredAt || order.createdAt
        });
      }
    });
  });

  return reviewableItems;
};