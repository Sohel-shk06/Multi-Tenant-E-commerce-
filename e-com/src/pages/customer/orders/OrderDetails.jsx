import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import { 
  ArrowLeft, Package, MapPin, CreditCard, Truck, 
  CheckCircle, Clock, XCircle, Store, Calendar 
} from 'lucide-react';
import { CancelOrder } from './CancelOrder';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link to="/customer/orders" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Status Timeline
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Vendor has confirmed your order' },
    { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', icon: Package, description: 'Package delivered to you' },
    { key: 'completed', label: 'Completed', icon: CheckCircle, description: 'Order completed successfully' },
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/customer/orders')} 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to My Orders</span>
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{order.orderNumber}</h1>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              {getStatusBadge(order.status)}
              <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="mt-1 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Status</h3>
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                {/* Steps */}
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={step.key} className="relative flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`mt-2 text-xs font-medium text-center ${
                        isCompleted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1 hidden sm:block max-w-[100px]">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Order Cancelled</p>
                  <p className="text-sm text-red-700">
                    {order.cancelledAt 
                      ? `Cancelled on ${new Date(order.cancelledAt).toLocaleString()}` 
                      : 'This order has been cancelled'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Items & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-500" />
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={`/products/${item.product?._id}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">
                        {item.title}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-base text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">📞 {order.shippingAddress.phone}</p>
                <p className="text-gray-600 mt-2">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Info */}
          <div className="space-y-6">
            {/* Store Info */}
            {order.store && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Store className="w-5 h-5 mr-2 text-gray-500" />
                  Sold By
                </h2>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {order.store.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.store.name}</p>
                    <Link to={`/stores/${order.store._id}`} className="text-xs text-blue-600 hover:underline">
                      Visit Store →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹{order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      `₹${order.shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold uppercase text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  {getPaymentBadge(order.paymentStatus)}
                </div>
                {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💰 Pay ₹{order.totalAmount.toLocaleString()} in cash when your order is delivered.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact vendor or support for any queries about this order.
              </p>
              {order.vendor && (
                <p className="text-xs text-gray-500">
                  Vendor: <span className="font-medium">{order.vendor.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <CancelOrder 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        order={order} 
      />
    </div>
  );
};