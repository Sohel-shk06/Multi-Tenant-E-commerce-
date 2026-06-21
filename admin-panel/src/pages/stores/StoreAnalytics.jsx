import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoreAnalytics } from '../../app/store/storeSlice';
import { ArrowLeft, Package, ShoppingCart, DollarSign, TrendingUp, Star } from 'lucide-react';

export const StoreAnalytics = () => {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeAnalytics: data, isLoading } = useSelector((state) => state.stores);

  useEffect(() => {
    dispatch(fetchStoreAnalytics(storeId));
  }, [dispatch, storeId]);

  if (isLoading || !data) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{data.storeName} - Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for this store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <DollarSign className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">₹{data.totalRevenue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <ShoppingCart className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-xl font-bold text-gray-900">{data.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <Package className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-xs text-gray-500">Total Products</p>
          <p className="text-xl font-bold text-gray-900">{data.totalProducts || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <TrendingUp className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-xs text-gray-500">Avg Order Value</p>
          <p className="text-xl font-bold text-gray-900">₹{data.avgOrderValue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <Star className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-xs text-gray-500">Avg Rating</p>
          <p className="text-xl font-bold text-gray-900">{data.avgRating?.toFixed(1) || '0.0'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue Trend</h2>
          {data.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
            <div className="space-y-2">
              {data.monthlyRevenue.map((item, idx) => {
                const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1);
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-20">{item.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">₹{item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No revenue data available.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h2>
          {data.topProducts && data.topProducts.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.sold} sold</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">₹{product.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No product sales data.</p>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
          {data.statusBreakdown && data.statusBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.statusBreakdown.map((item, idx) => {
                const colors = {
                  pending: 'bg-yellow-500',
                  confirmed: 'bg-blue-500',
                  shipped: 'bg-purple-500',
                  delivered: 'bg-green-500',
                  completed: 'bg-emerald-500',
                  cancelled: 'bg-red-500'
                };
                const maxCount = Math.max(...data.statusBreakdown.map(s => s.count), 1);
                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{item._id}</span>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${colors[item._id] || 'bg-gray-500'} h-full`}
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No order data.</p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Low Stock Products</h2>
          {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {data.lowStockProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{product.title}</p>
                  <span className={`text-sm font-bold ${product.stock <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">✅ All products well stocked!</p>
          )}
        </div>
      </div>
    </div>
  );
};