import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resolveDispute } from '../../app/store/disputeSlice';
import { X, AlertCircle } from 'lucide-react';

export const ResolveDispute = ({ dispute, onClose }) => {
  const dispatch = useDispatch();
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resolution) {
      alert('Please select a resolution type');
      return;
    }

    if (resolution === 'partial_refund' && (!refundAmount || refundAmount <= 0)) {
      alert('Please enter a valid refund amount');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(resolveDispute({
        disputeId: dispute._id,
        data: {
          resolution,
          refundAmount: resolution === 'partial_refund' ? parseFloat(refundAmount) : 0,
          adminNotes
        }
      }));
      alert('✅ Dispute resolved successfully!');
      onClose();
    } catch (error) {
      alert('❌ Failed to resolve dispute: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Resolve Dispute</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">Order Details</p>
            <p className="text-sm text-blue-700">
              Order: {dispute.order?.orderNumber} | Total: ₹{dispute.order?.totalAmount?.toLocaleString()}
            </p>
          </div>

          {/* Resolution Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution Type <span className="text-red-500">*</span>
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select resolution...</option>
              <option value="full_refund">Full Refund to Customer</option>
              <option value="partial_refund">Partial Refund to Customer</option>
              <option value="replacement">Product Replacement</option>
              <option value="rejected">Reject Dispute (Vendor Wins)</option>
            </select>
          </div>

          {/* Refund Amount (only for partial refund) */}
          {resolution === 'partial_refund' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={dispute.order?.totalAmount}
                min="1"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter refund amount"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ₹{dispute.order?.totalAmount?.toLocaleString()}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="4"
              maxLength="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain your decision..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {adminNotes.length}/1000 characters
            </p>
          </div>

          {/* Warning */}
          {(resolution === 'full_refund' || resolution === 'partial_refund') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Refund Warning</p>
                <p>
                  {resolution === 'full_refund' 
                    ? `Full refund of ₹${dispute.order?.totalAmount?.toLocaleString()} will be processed to the customer.`
                    : `Partial refund of ₹${refundAmount || 0} will be processed to the customer.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Resolving...' : 'Resolve Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};