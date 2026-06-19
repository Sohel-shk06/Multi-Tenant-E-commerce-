import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { ArrowLeft, Star, Package, Edit, Trash2, CheckCircle } from 'lucide-react';

export const ReviewDetails = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = async () => {
    try {
      const data = await vendorService.getVendorReview(reviewId);
      setReview(data);
      if (data.vendorReply) setReplyText(data.vendorReply);
    } catch (error) {
      console.error('Failed to load review', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await vendorService.replyToReview(reviewId, replyText);
      setMessage({ type: 'success', text: 'Reply submitted successfully!' });
      setIsEditing(false);
      loadReview();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit reply' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!window.confirm('Are you sure you want to delete your reply?')) return;
    try {
      await vendorService.deleteVendorReply(reviewId);
      setMessage({ type: 'success', text: 'Reply deleted successfully!' });
      loadReview();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete reply' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Review not found.</p>
        <Link to="/vendor/reviews" className="text-blue-600 hover:underline mt-2 inline-block">Back to Reviews</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/vendor/reviews')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Reviews</span>
      </button>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Review Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {review.product?.images?.[0]?.url ? (
              <img src={review.product.images[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Link to={`/products/${review.product?._id}`} className="text-sm font-semibold text-blue-600 hover:underline">
              {review.product?.title}
            </Link>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm font-medium text-gray-900">{review.customer?.name}</span>
              {review.isVerifiedPurchase && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="inline-flex items-center text-xs text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Purchase
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Order: {review.order?.orderNumber} • {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{review.title}</h2>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

        {review.helpfulCount > 0 && (
          <p className="text-xs text-gray-500 mt-3">👍 {review.helpfulCount} customers found this helpful</p>
        )}
      </div>

      {/* Reply Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {review.vendorReply ? 'Your Reply' : 'Reply to this Review'}
          </h3>
          {review.vendorReply && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteReply}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {review.vendorReply && !isEditing ? (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-gray-700">{review.vendorReply}</p>
            <p className="text-xs text-gray-500 mt-2">
              Replied on {new Date(review.vendorReplyAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Write a professional reply to this customer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500">{replyText.length}/500 characters</p>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
              >
                {submitting ? 'Submitting...' : (review.vendorReply ? 'Update Reply' : 'Submit Reply')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setReplyText(review.vendorReply || '');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};