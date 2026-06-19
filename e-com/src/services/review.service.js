import api from './api';

export const reviewService = {
  // Public
  getProductReviews: async (productId, params) => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data.data;
  },

  // Protected (Customer)
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data.data;
  },

  getMyReviews: async (params) => {
    const response = await api.get('/reviews/my-reviews', { params });
    return response.data.data;
  },

  getReviewableProducts: async () => {
    const response = await api.get('/reviews/reviewable');
    return response.data.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.patch(`/reviews/${reviewId}`, reviewData);
    return response.data.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data.data;
  },

  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data.data;
  }
};