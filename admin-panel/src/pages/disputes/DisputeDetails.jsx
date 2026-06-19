import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispute, resolveDispute, updateDisputeStatus } from '../../app/store/disputeSlice';
import { 
  ArrowLeft, AlertTriangle, CheckCircle, Clock, XCircle, 
  User, Store, ShoppingCart, MessageSquare, DollarSign
} from 'lucide-react';
import { ResolveDispute } from './ResolveDispute';

export const DisputeDetails = () => {
  const { disputeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDispute: dispute, isLoading, error } = useSelector((state) => state.disputes);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDispute(disputeId));
  }, [dispatch, disputeId]);

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Are you sure you want to change status to '${newStatus}'?`)) {
      dispatch(updateDisputeStatus({ 
        disputeId, 
        data: { status: newStatus } 
      }));
    }
  };

  if (isLoading || !dispute) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800 border-red-200',
      under_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      vendor_responded: 'bg-blue-100 text-blue-800 border-blue-200',
      resolved_customer: 'bg-green-100 text-green-800 border-green-200',
      resolved_vendor: 'bg-purple-100 text-purple-800 border-purple-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)} Priority
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate('/admin/disputes')} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Disputes</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dispute.subject}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Opened on {new Date(dispute.openedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getPriorityBadge(dispute.priority)}
            {getStatusBadge(dispute.status)}
          </div>
        </div>

        {/* Quick Actions */}
        {dispute.status !== 'closed' && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {dispute.status === 'open' && (
              <button
                onClick={() => handleStatusChange('under_review')}
                className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                Mark Under Review
              </button>
            )}
            {(dispute.status === 'under_review' || dispute.status === 'vendor_responded') && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Resolve Dispute
              </button>
            )}
            <button
              onClick={() => handleStatusChange('closed')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close Dispute
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Dispute Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {dispute.reason?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {dispute.description}
                </p>
              </div>
              {dispute.resolution !== 'none' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Resolution</p>
                  <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="font-semibold">{dispute.resolution?.replace(/_/g, ' ').toUpperCase()}</span>
                    {dispute.refundAmount > 0 && (
                      <span className="ml-2 text-green-700">- Refund: ₹{dispute.refundAmount.toLocaleString()}</span>
                    )}
                  </p>
                </div>
              )}
              {dispute.adminNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes</p>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {dispute.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Thread */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Conversation ({dispute.messages?.length || 0})
            </h2>
            <div className="space-y-4">
              {dispute.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    msg.senderRole === 'admin' ? 'bg-blue-50 border border-blue-200' :
                    msg.senderRole === 'customer' ? 'bg-green-50 border border-green-200' :
                    'bg-purple-50 border border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold uppercase ${
                        msg.senderRole === 'admin' ? 'text-blue-700' :
                        msg.senderRole === 'customer' ? 'text-green-700' :
                        'text-purple-700'
                      }`}>
                        {msg.senderRole}
                      </span>
                      <span className="text-xs text-gray-500">
                        {msg.sender?.name || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order, Customer, Vendor Info */}
        <div className="space-y-6">
          {/* Order Info */}
          {dispute.order && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
                Order Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-mono font-medium">{dispute.order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold">₹{dispute.order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="capitalize">{dispute.order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="capitalize">{dispute.order.paymentStatus}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          {dispute.customer && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Customer
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{dispute.customer.name}</p>
                <p className="text-gray-500">{dispute.customer.email}</p>
                {dispute.customer.phone && (
                  <p className="text-gray-500">{dispute.customer.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Vendor Info */}
          {dispute.vendor && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2 text-purple-600" />
                Vendor
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{dispute.vendor.name}</p>
                <p className="text-gray-500">{dispute.vendor.email}</p>
                {dispute.vendor.phone && (
                  <p className="text-gray-500">{dispute.vendor.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Timeline
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Dispute Opened</p>
                  <p className="text-xs text-gray-500">
                    {new Date(dispute.openedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {dispute.resolvedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Dispute Resolved</p>
                    <p className="text-xs text-gray-500">
                      {new Date(dispute.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveDispute
          dispute={dispute}
          onClose={() => setShowResolveModal(false)}
        />
      )}
    </div>
  );
};