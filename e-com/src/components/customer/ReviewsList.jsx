import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import { reviewService } from '../../services/review.service';

export const ReviewsList = ({ productId, averageRating = 0, totalReviews = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [filter, setFilter] = useState({ rating: '', sort: 'recent' });

  useEffect(() => {
    loadReviews();
  }, [productId, filter]);

  const loadReviews = async (page = 1) => {
    setLoading(true);
    try {
      const data = await reviewService.getProductReviews(productId, {
        page,
        limit: 5,
        rating: filter.rating,
        sort: filter.sort
      });
      setReviews(data.reviews || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });
      if (data.ratingDistribution) {
        setRatingDistribution(data.ratingDistribution);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      setReviews(reviews.map(r => 
        r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      ));
    } catch (error) {
      console.error('Failed to mark helpful', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  const getPercentage = (count) => {
    const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    return total > 0 ? (count / total) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-gray-500" />
        Customer Reviews ({totalReviews})
      </h2>

      {totalReviews > 0 ? (
        <>
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-200 mb-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size="md" />
              <p className="text-sm text-gray-500 mt-2">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => handleFilterChange('rating', filter.rating === star ? '' : star)}
                  className={`w-full flex items-center space-x-3 hover:bg-gray-50 p-1 rounded transition-colors ${
                    filter.rating === star ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700 w-12">{star} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${getPercentage(ratingDistribution[star])}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-10 text-right">
                    {ratingDistribution[star]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filter.rating ? `Showing ${filter.rating}-star reviews` : 'All reviews'}
            </p>
            <select
              value={filter.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.customer?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.customer?.name}</p>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={review.rating} size="sm" />
                          {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center space-x-4 mt-3">
                    <button
                      onClick={() => handleMarkHelpful(review._id)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4">
                  <button
                    onClick={() => loadReviews(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => loadReviews(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews match your filter.</p>
              <button
                onClick={() => handleFilterChange('rating', '')}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filter
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
};