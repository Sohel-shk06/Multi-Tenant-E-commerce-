import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resolveDispute } from '../../app/store/disputeSlice';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export const ResolveDispute = ({ dispute, onClose }) => {
  const dispatch = useDispatch();
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resolution) { alert('Please select a resolution type'); return; }
    if (resolution === 'partial_refund' && (!refundAmount || refundAmount <= 0)) {
      alert('Please enter a valid refund amount'); return;
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
      onClose();
    } catch (error) {
      alert('Failed to resolve dispute: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: '16px', border: '1px solid #e0e4f7', boxShadow: '0 4px 0 #C7D2FE, 0 8px 30px rgba(67,56,202,0.15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: '#1E1B4B' }}>Resolve Dispute</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Choose resolution and provide notes</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Order Info */}
          <div
            className="p-3.5 rounded-xl border"
            style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#4338CA' }}>Order Details</p>
            <p className="text-[13px] font-medium" style={{ color: '#312E81' }}>
              Order #{dispute.order?.orderNumber}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Total: ₹{dispute.order?.totalAmount?.toLocaleString()}
            </p>
          </div>

          {/* Resolution Type */}
          <div>
            <label className={labelClass}>Resolution Type *</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select resolution...</option>
              <option value="full_refund">Full Refund to Customer</option>
              <option value="partial_refund">Partial Refund to Customer</option>
              <option value="replacement">Product Replacement</option>
              <option value="rejected">Reject Dispute (Vendor Wins)</option>
            </select>
          </div>

          {/* Partial Refund Amount */}
          {resolution === 'partial_refund' && (
            <div>
              <label className={labelClass}>Refund Amount (₹) *</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={dispute.order?.totalAmount}
                min="1"
                step="0.01"
                className={inputClass}
                placeholder="Enter refund amount"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Maximum: ₹{dispute.order?.totalAmount?.toLocaleString()}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className={labelClass}>Admin Notes (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="3"
              maxLength="1000"
              className={inputClass}
              placeholder="Explain your decision..."
              style={{ resize: 'none' }}
            />
            <p className="text-[11px] text-gray-400 mt-1">{adminNotes.length}/1000</p>
          </div>

          {/* Refund Warning */}
          {(resolution === 'full_refund' || resolution === 'partial_refund') && (
            <div
              className="flex items-start gap-3 p-3.5 rounded-xl border"
              style={{ backgroundColor: '#FEF9C3', borderColor: '#FDE047' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A16207' }} />
              <div>
                <p className="text-[12px] font-semibold" style={{ color: '#A16207' }}>Refund Warning</p>
                <p className="text-[12px] mt-0.5" style={{ color: '#A16207' }}>
                  {resolution === 'full_refund'
                    ? `Full refund of ₹${dispute.order?.totalAmount?.toLocaleString()} will be processed.`
                    : `Partial refund of ₹${refundAmount || 0} will be processed.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg,#6366F1,#4338CA)',
                boxShadow: '0 2px 0 #312E81, 0 3px 8px rgba(67,56,202,0.25)'
              }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 0 #312E81, 0 5px 12px rgba(67,56,202,0.3)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 0 #312E81, 0 3px 8px rgba(67,56,202,0.25)' }}
            >
              {isSubmitting
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <CheckCircle className="w-4 h-4" />
              }
              {isSubmitting ? 'Resolving...' : 'Resolve Dispute'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};