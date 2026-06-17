import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';

export const CancelOrder = ({ isOpen, onClose, order }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !order) return null;

  const reasons = [
    'Ordered by mistake',
    'Found a better price',
    'Shipping is taking too long',
    'Changed my mind',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for cancellation');
      return;
    }

    const finalReason = reason === 'Other' ? `Other: ${otherReason}` : reason;
    if (reason === 'Other' && !otherReason.trim()) {
      setError('Please provide more details for your cancellation reason');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/orders/${order._id}/cancel`, { reason: finalReason });
      setSuccess('Your order has been cancelled successfully.');
      setTimeout(() => {
        onClose();
        navigate('/customer/orders');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden z-10 transform transition-all p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">Order ID: {order.orderNumber}</p>
        </div>

        {/* Success/Error Banners */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700 font-medium flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200 text-sm text-green-700 font-medium">
            {success}
          </div>
        )}

        {/* Main Content */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-800 text-sm">
              Are you sure you want to cancel this order? This action cannot be undone.
            </div>

            {/* Refund Info Banner */}
            {isPaid && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Your refund will be processed to your original payment method within 3-5 business days.</span>
              </div>
            )}

            {/* Selection of reasons */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              
              <div className="space-y-2.5">
                {reasons.map((r) => (
                  <label 
                    key={r} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      reason === r 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setError('');
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-800 font-medium">{r}</span>
                  </label>
                ))}
              </div>

              {/* Conditional text area for "Other" */}
              {reason === 'Other' && (
                <div className="mt-3 space-y-1">
                  <label className="block text-xs font-semibold text-gray-600">
                    Please specify <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={otherReason}
                    onChange={(e) => {
                      setOtherReason(e.target.value);
                      setError('');
                    }}
                    placeholder="Provide additional details..."
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="w-1/2 font-semibold"
              >
                Keep Order
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={loading}
                className="w-1/2 flex items-center justify-center space-x-2 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Cancel</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
