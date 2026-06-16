import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTransaction } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, CreditCard, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export const PaymentDetails = () => {
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTransaction: tx, isLoading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchTransaction(paymentId));
  }, [dispatch, paymentId]);

  if (isLoading || !tx) return <PageLoader />;

  const getStatusIcon = (status) => {
    if (status === 'paid') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'paid') return 'bg-green-50 border-green-200 text-green-800';
    if (status === 'failed') return 'bg-red-50 border-red-200 text-red-800';
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/payments')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Transactions</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-600 mt-1 font-mono">{tx.transactionId || tx._id}</p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(tx.paymentStatus)}`}>
              {getStatusIcon(tx.paymentStatus)}
              <span className="font-semibold capitalize">{tx.paymentStatus}</span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <p className="text-3xl font-bold text-gray-900">₹{tx.amount?.toLocaleString()}</p>
          </div>

          {/* Payment Method */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-700" />
              <p className="text-lg font-semibold text-gray-900 uppercase">{tx.paymentMethod}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Customer</p>
            </div>
            <p className="font-semibold text-gray-900">{tx.customer?.name || 'Guest'}</p>
            <p className="text-sm text-gray-600">{tx.customer?.email}</p>
            {tx.customer?.phone && <p className="text-sm text-gray-600">{tx.customer.phone}</p>}
          </div>

          {/* Date Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Date</p>
            </div>
            <p className="font-semibold text-gray-900">{new Date(tx.createdAt).toLocaleString()}</p>
            {tx.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">Updated: {new Date(tx.updatedAt).toLocaleString()}</p>
            )}
          </div>

          {/* Order Info */}
          {tx.order && (
            <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
              <p className="text-sm text-blue-700 mb-2">Associated Order</p>
              <p className="font-semibold text-gray-900">Order #{tx.order.orderNumber}</p>
              <p className="text-sm text-gray-600">Total: ₹{tx.order.totalAmount?.toLocaleString()}</p>
            </div>
          )}

          {/* Vendor Info */}
          {tx.vendor && (
            <div className="p-4 bg-green-50 rounded-lg md:col-span-2">
              <p className="text-sm text-green-700 mb-2">Vendor</p>
              <p className="font-semibold text-gray-900">{tx.vendor.name}</p>
              <p className="text-sm text-gray-600">{tx.vendor.email}</p>
            </div>
          )}

          {/* Gateway Response */}
          {tx.gatewayResponse && (
            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Gateway Response</p>
              <pre className="text-xs text-gray-700 overflow-x-auto">{JSON.stringify(tx.gatewayResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};