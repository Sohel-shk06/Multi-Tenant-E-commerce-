import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';

export const OrderAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getOrderAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load order analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const totalOrders = data.stats.totalOrders;
  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your orders.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{data.stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Avg Order Value</span>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{Math.round(data.stats.avgOrderValue).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
          <div className="space-y-3">
            {data.statusBreakdown.map((item, idx) => {
              const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{item._id}</span>
                    <span className="text-sm text-gray-500">{item.count} orders</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[item._id] || 'bg-gray-400'} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {data.paymentBreakdown.map((item, idx) => {
              const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 uppercase">{item._id}</p>
                      <p className="text-xs text-gray-500">{item.count} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Trend (Last 7 Days) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days Trend</h2>
        {data.recentTrend.length > 0 ? (
          <div className="space-y-3">
            {data.recentTrend.map((day, idx) => {
              const maxOrders = Math.max(...data.recentTrend.map(d => d.orders), 1);
              return (
                <div key={idx} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-24">{day._id}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-end pr-2"
                      style={{ width: `${(day.orders / maxOrders) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.orders}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-24 text-right">₹{day.revenue.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No orders in the last 7 days.</p>
        )}
      </div>
    </div>
  );
};