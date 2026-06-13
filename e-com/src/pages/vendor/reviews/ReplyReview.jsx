import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { ArrowLeft, Send } from 'lucide-react';

export const ReplyReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await vendorService.replyToReview(reviewId, replyText);
      setMessage({ type: 'success', text: 'Reply submitted successfully!' });
      setTimeout(() => navigate('/vendor/reviews'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit reply' });
    } finally {
      setSubmitting(false);
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
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
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

      {/* Original Review */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <p className="text-xs text-gray-500 mb-2">Customer Review:</p>
        <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
        <p className="text-sm text-gray-700">{review.comment}</p>
        <p className="text-xs text-gray-500 mt-2">— {review.customer?.name}</p>
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Write Your Reply</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            maxLength={500}
            placeholder="Thank the customer for their feedback and address any concerns..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          <p className="text-xs text-gray-500">{replyText.length}/500 characters</p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Reply'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};