import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { reviewService } from '../../../services/review.service';
import { ReviewForm } from '../../../components/customer/ReviewForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (reviewData) => {
    setLoading(true);
    setError('');
    try {
      await reviewService.createReview(reviewData);
      alert('✅ Review submitted successfully!');
      navigate('/customer/reviews');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Agar params nahi hain, toh error message dikhao (redirect mat karo)
  if (!productId || !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Review Request</h2>
            <p className="text-gray-600 mb-6">
              Product ID aur Order ID required hai review likhne ke liye.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/customer/orders"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to My Orders
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/customer/orders')} 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Product ID:</span> {productId}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Order ID:</span> {orderId}
          </p>
        </div>

        <ReviewForm 
          productId={productId}
          orderId={orderId}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customer/orders')}
          loading={loading}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};