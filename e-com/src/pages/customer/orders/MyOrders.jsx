import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { ShoppingBag, Eye, Package, RefreshCw, Star } from 'lucide-react'; // ✅ Star icon added

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
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-mono font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.status)}
                  <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {order.store?.name || 'Store'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {order.items.length} item(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-500 pl-15">
                      + {order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Payment:</span>{' '}
                  <span className="uppercase">{order.paymentMethod}</span>
                  {' • '}
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                
                  {/* ✅ Write Review Button - URL params ke saath */}
{(order.status === 'delivered' || order.status === 'completed') && order.items.length > 0 && (
  <Link
    to={`/customer/reviews/write?productId=${order.items[0].product?._id || order.items[0].product}&orderId=${order._id}`}
    className="inline-flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-medium"
  >
    <Star className="w-4 h-4" />
    <span>Write Review</span>
  </Link>
)}
                  
                  <Link
                    to={`/customer/orders/${order._id}`}
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};