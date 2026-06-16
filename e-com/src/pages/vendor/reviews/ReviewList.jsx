import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { Star, Eye, MessageSquare, Filter, ChevronLeft, ChevronRight, Package } from 'lucide-react';

export const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalReviews: 0 });
  const [filter, setFilter] = useState({ rating: '', sort: 'recent' });

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async (page = 1) => {
    setLoading(true);
    try {
      const data = await vendorService.getVendorReviews({
        page,
        limit: 10,
        rating: filter.rating,
        sort: filter.sort
      });
      setReviews(data.reviews || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalReviews: data.totalReviews
      });
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, size = 'sm' }) => (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.totalReviews} total reviews</p>
        </div>
        <Link
          to="/vendor/reviews/analytics"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          <span>View Analytics</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        <select
          value={filter.rating}
          onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <select
          value={filter.sort}
          onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="unreplied">Unreplied First</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {review.product?.images?.[0]?.url ? (
                      <img src={review.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link to={`/products/${review.product?._id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {review.product?.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{review.customer?.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/vendor/reviews/${review._id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </Link>
              </div>

              {/* Review Content */}
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

              {/* Vendor Reply */}
              {review.vendorReply ? (
                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-xs font-semibold text-green-800 mb-1">Your Reply:</p>
                  <p className="text-sm text-gray-700">{review.vendorReply}</p>
                </div>
              ) : (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-xs text-yellow-800">⚠️ No reply yet. Respond to build customer trust!</p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadReviews(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadReviews(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
          <p className="text-sm text-gray-500 mt-2">Reviews from customers will appear here.</p>
        </div>
      )}
    </div>
  );
};