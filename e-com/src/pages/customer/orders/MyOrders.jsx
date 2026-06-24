import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { ShoppingBag, Eye, Package, RefreshCw, Star } from 'lucide-react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders', { params: { limit: 50 } });
      setOrders(response.data.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-[#EEE9FF] text-[#6C4EFF]',
      shipped: 'bg-[#EEE9FF] text-[#6C4EFF]',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E1E2F] tracking-tight">My Orders</h1>
            <p className="text-sm font-medium text-[#6B7280] mt-1">Track purchases, payments, and review-ready deliveries.</p>
          </div>
          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 border border-[#E9E7F5] bg-white text-[#1E1E2F] rounded-xl font-semibold shadow-sm hover:border-[#6C4EFF] hover:text-[#6C4EFF] hover:shadow-md transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {loading && orders.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4EFF]"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] overflow-hidden transition-all duration-200 hover:shadow-md">
                {/* Order Header */}
                <div className="p-4 bg-[#F8F7FC] border-b border-[#E9E7F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-mono font-semibold text-[#1E1E2F]">{order.orderNumber}</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-bold text-[#1E1E2F]">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm font-semibold text-[#1E1E2F]">
                        {order.store?.name || 'Store'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#6B7280]">
                      {order.items.length} item(s)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#F8F7FC] rounded-xl flex-shrink-0 overflow-hidden">
                          {item.product?.images?.[0]?.url ? (
                            <img src={item.product.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-[#6B7280]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E1E2F] truncate">{item.title}</p>
                          <p className="text-xs text-[#6B7280]">Qty: {item.quantity} x ₹{item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1E1E2F]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs font-medium text-[#6B7280] pl-15">
                        + {order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-[#F8F7FC] border-t border-[#E9E7F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs text-[#6B7280]">
                    <span className="font-semibold">Payment:</span>{' '}
                    <span className="uppercase">{order.paymentMethod}</span>
                    {' • '}
                    <span className={`font-semibold ${
                      order.paymentStatus === 'paid' ? 'text-green-600' :
                      order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {(order.status === 'delivered' || order.status === 'completed') && order.items.length > 0 && (
                      <Link
                        to={`/customer/reviews/write?productId=${order.items[0].product?._id || order.items[0].product}&orderId=${order._id}`}
                        className="inline-flex items-center space-x-1.5 text-sm text-green-600 hover:text-green-700 font-semibold"
                      >
                        <Star className="w-4 h-4" />
                        <span>Write Review</span>
                      </Link>
                    )}

                    <Link
                      to={`/customer/orders/${order._id}`}
                      className="inline-flex items-center space-x-1.5 text-sm text-[#6C4EFF] hover:text-[#5B3EE0] font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-10 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EEE9FF] text-[#6C4EFF] mx-auto mb-5 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1E1E2F]">No orders yet</h3>
            <p className="text-sm font-medium text-[#6B7280] mt-2 mb-6">Start shopping to see your orders here.</p>
            <Link to="/products" className="inline-flex items-center px-6 py-3 bg-[#6C4EFF] text-white rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
