import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder } from '../../app/store/orderSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrder(orderId));
  }, [dispatch, orderId]);

  if (isLoading || !order) return <PageLoader />;

  const getStatusStyle = (status) => {
    const styles = {
      pending:   { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      confirmed: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
      shipped:   { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
      delivered: { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      completed: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
      cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    };
    return styles[status] || styles.pending;
  };

  const getPaymentStyle = (status) => {
    if (status === 'paid') return { color: '#15803D' };
    if (status === 'failed') return { color: '#DC2626' };
    return { color: '#A16207' };
  };

  const s = getStatusStyle(order.status);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-gray-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border"
          style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — Items + Address */}
        <div className="lg:col-span-2 space-y-4">

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EEF2FF' }}>
                <Package className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Order Items</p>
                <p className="text-[11px] text-gray-400">{order.items.length} item(s)</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{item.title}</p>
                    {item.variant && (
                      <p className="text-[11px] text-gray-400">Variant: {item.variant}</p>
                    )}
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EEF2FF' }}>
                <MapPin className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Shipping Address</p>
            </div>
            <div className="p-5 space-y-1">
              <p className="text-[13px] font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-[13px] text-gray-500">{order.shippingAddress.phone}</p>
              <p className="text-[13px] text-gray-500">{order.shippingAddress.address}</p>
              <p className="text-[13px] text-gray-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-[13px] text-gray-500">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Right — Summary, Payment, Customer */}
        <div className="space-y-4">

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EEF2FF' }}>
                <CreditCard className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Order Summary</p>
            </div>
            <div className="p-5 space-y-2.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">₹{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Tax (18%)</span>
                <span className="font-medium text-gray-900">₹{order.tax?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">₹{order.shippingCost?.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[13px] text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between text-[14px] font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-900">Payment Info</p>
            </div>
            <div className="p-5 space-y-2.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900 uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Status</span>
                <span className="font-medium" style={getPaymentStyle(order.paymentStatus)}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
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
                {order.customer?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-900">{order.customer?.name}</p>
                <p className="text-[11px] text-gray-400">{order.customer?.email}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};