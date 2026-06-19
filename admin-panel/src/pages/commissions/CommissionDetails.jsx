import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommission, updateCommissionStatus } from '../../app/store/commissionSlice';
import { 
  ArrowLeft, DollarSign, ShoppingCart, Calendar, 
  CheckCircle, Clock, XCircle, Store, AlertCircle
} from 'lucide-react';

export const CommissionDetails = () => {
  const { commissionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCommission: commission, isLoading, error } = 
    useSelector((state) => state.commissions);
  
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchCommission(commissionId));
  }, [dispatch, commissionId]);

  const handleCollect = async () => {
    if (window.confirm('Are you sure you want to collect this commission?')) {
      setIsUpdating(true);
      try {
        await dispatch(updateCommissionStatus({ 
          commissionId, 
          data: { 
            status: 'collected',
            notes: 'Manually collected by admin'
          } 
        }));
        dispatch(fetchCommission(commissionId));
        alert('✅ Commission collected successfully!');
      } catch (error) {
        alert('❌ Failed to collect commission: ' + error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRefund = async () => {
    if (window.confirm('Are you sure you want to refund this commission?')) {
      setIsUpdating(true);
      try {
        await dispatch(updateCommissionStatus({ 
          commissionId, 
          data: { 
            status: 'refunded',
            notes: 'Commission refunded by admin'
          } 
        }));
        dispatch(fetchCommission(commissionId));
        alert('✅ Commission refunded successfully!');
      } catch (error) {
        alert('❌ Failed to refund commission: ' + error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (isLoading || !commission) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      earned: 'bg-green-100 text-green-800 border-green-200',
      collected: 'bg-blue-100 text-blue-800 border-blue-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      earned: <CheckCircle className="w-4 h-4" />,
      collected: <DollarSign className="w-4 h-4" />,
      refunded: <XCircle className="w-4 h-4" />
    };
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {icons[status]}
        <span>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin/commissions')} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Commissions</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commission Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on {new Date(commission.createdAt).toLocaleString()}
            </p>
          </div>
          {getStatusBadge(commission.status)}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Order Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{commission.orderAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <span className="text-sm text-gray-600">Platform Commission</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {(commission.commissionRate * 100).toFixed(0)}% of order amount
                  </p>
                </div>
                <span className="text-xl font-bold text-green-600">
                  ₹{commission.commissionAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <span className="text-sm text-gray-600">Vendor Receives</span>
                  <p className="text-xs text-gray-500 mt-1">After commission deduction</p>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  ₹{commission.vendorAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {commission.order && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                Order Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Number</span>
                  <Link 
                    to={`/admin/orders/${commission.order._id}`}
                    className="text-sm font-mono font-medium text-blue-600 hover:underline"
                  >
                    {commission.order.orderNumber}
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Status</span>
                  <span className="text-sm font-medium capitalize text-gray-900">
                    {commission.order.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {commission.vendor && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2 text-purple-600" />
                Vendor Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {commission.vendor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{commission.vendor.name}</p>
                    <p className="text-xs text-gray-500">{commission.vendor.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {(commission.status === 'pending' || commission.status === 'earned') && (
                <>
                  <button
                    onClick={handleCollect}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                    <span>Collect Commission</span>
                  </button>

                  <button
                    onClick={handleRefund}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>Refund Commission</span>
                  </button>
                </>
              )}

              {commission.status === 'collected' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold text-blue-900">Commission Collected</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    This commission has been successfully collected.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};