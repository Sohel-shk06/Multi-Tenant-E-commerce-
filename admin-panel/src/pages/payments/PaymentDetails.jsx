import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTransaction } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, CreditCard, User, Calendar, CheckCircle, XCircle, Clock, ShoppingCart, Store } from 'lucide-react';

export const PaymentDetails = () => {
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTransaction: tx, isLoading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchTransaction(paymentId));
  }, [dispatch, paymentId]);

  if (isLoading || !tx) return <PageLoader />;

  const getStatusBadge = (status) => {
    const styles = {
      paid:     { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      pending:  { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      failed:   { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      refunded: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
    };
    const s = styles[status] || { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
    const icons = {
      paid: <CheckCircle className="w-3.5 h-3.5" />,
      failed: <XCircle className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />,
      refunded: <CheckCircle className="w-3.5 h-3.5" />,
    };
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {icons[status]}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/payments')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-gray-900">Payment Details</h1>
            <p className="text-[12px] font-mono text-gray-400 mt-0.5">
              {tx.transactionId || tx._id}
            </p>
          </div>
        </div>
        {getStatusBadge(tx.paymentStatus)}
      </div>

      {/* Amount + Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide mb-2">Amount</p>
          <p className="text-[32px] font-bold text-gray-900 leading-none">
            ₹{tx.amount?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide mb-2">Payment Method</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <CreditCard className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <span className="text-[16px] font-semibold text-gray-900 uppercase">
              {tx.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <User className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Customer</p>
          </div>
          <div className="p-5 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
              style={{ backgroundColor: '#4338CA' }}
            >
              {tx.customer?.name?.charAt(0).toUpperCase() || 'G'}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900">{tx.customer?.name || 'Guest'}</p>
              <p className="text-[11px] text-gray-400">{tx.customer?.email}</p>
              {tx.customer?.phone && (
                <p className="text-[11px] text-gray-400">{tx.customer.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <Calendar className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Date & Time</p>
          </div>
          <div className="p-5 space-y-1">
            <p className="text-[13px] font-medium text-gray-900">
              {new Date(tx.createdAt).toLocaleString('en-IN')}
            </p>
            {tx.updatedAt && (
              <p className="text-[11px] text-gray-400">
                Updated: {new Date(tx.updatedAt).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Order */}
        {tx.order && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EEF2FF' }}>
                <ShoppingCart className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Associated Order</p>
            </div>
            <div className="p-5 space-y-1">
              <p className="text-[13px] font-medium text-gray-900">
                Order #{tx.order.orderNumber}
              </p>
              <p className="text-[11px] text-gray-400">
                Total: ₹{tx.order.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Vendor */}
        {tx.vendor && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EEF2FF' }}>
                <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Vendor</p>
            </div>
            <div className="p-5 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                style={{ backgroundColor: '#4338CA' }}
              >
                {tx.vendor?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-900">{tx.vendor.name}</p>
                <p className="text-[11px] text-gray-400">{tx.vendor.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gateway Response */}
      {tx.gatewayResponse && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-900">Gateway Response</p>
          </div>
          <div className="p-5">
            <pre className="text-[12px] text-gray-600 overflow-x-auto bg-gray-50 rounded-lg p-3 border border-gray-100">
              {JSON.stringify(tx.gatewayResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};