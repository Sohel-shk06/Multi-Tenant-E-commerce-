import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../../../services/review.service';
import { StarRating } from '../../../components/customer/StarRating';
import { Edit, Trash2, Star, Package, ArrowLeft } from 'lucide-react';

export const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async (page = 1) => {
    setLoading(true);
    try {
      const data = await reviewService.getMyReviews({ page, limit: 10 });
      setReviews(data.reviews || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/customer/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Profile</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500 fill-yellow-500" />
              My Reviews
            </h1>
            <span className="text-sm text-gray-500">{pagination.totalPages > 0 ? `${reviews.length} review(s)` : 'No reviews yet'}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Verified Purchase
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                      
                      <Link 
                        to={`/products/${review.product?._id}`} 
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Package className="w-3 h-3 mr-1" />
                        {review.product?.title || 'View Product'}
                      </Link>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/customer/reviews/edit/${review._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Review"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                  <button
                    onClick={() => loadReviews(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</span>
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
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">You haven't written any reviews yet.</p>
              <Link to="/customer/orders" className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">
                Go to My Orders to review products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};