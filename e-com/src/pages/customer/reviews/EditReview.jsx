import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviewService } from '../../../services/review.service';
import { StarRating } from '../../../components/customer/StarRating';
import { ArrowLeft, Save } from 'lucide-react';

export const EditReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = async () => {
    try {
      // Note: getMyReviews se specific review nikal sakte hain, ya backend mein getReviewById add kar sakte hain.
      // Abhi ke liye, hum getMyReviews fetch karke match karenge (simple approach)
      const data = await reviewService.getMyReviews({ limit: 50 });
      const review = data.reviews.find(r => r._id === reviewId);
      
      if (review) {
        setFormData({
          rating: review.rating,
          title: review.title,
          comment: review.comment
        });
      } else {
        setError('Review not found');
      }
    } catch (err) {
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.updateReview(reviewId, formData);
      alert('✅ Review updated successfully!');
      navigate('/customer/reviews');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/customer/reviews')} 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to My Reviews</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Review</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(r) => setFormData({ ...formData, rating: r })} 
                size="lg"
                interactive={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={100}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                maxLength={1000}
                rows={5}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/1000 characters</p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/customer/reviews')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};