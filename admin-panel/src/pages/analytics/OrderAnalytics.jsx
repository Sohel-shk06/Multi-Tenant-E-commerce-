import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';

export const OrderAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getOrderAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load order analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const maxCount = Math.max(...data.statusBreakdown.map(s => s.count), 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Order trends and status breakdown.</p>
      </div>

      {/* Total Orders Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <ShoppingCart className="w-6 h-6" />
          <h2 className="text-lg font-bold">Total Orders</h2>
        </div>
        <p className="text-4xl font-bold">{data.summary.totalOrders}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {data.statusBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item._id] || 'bg-gray-100 text-gray-800'}`}>
                    {item._id?.charAt(0).toUpperCase() + item._id?.slice(1)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Payment Methods
          </h2>
          <div className="space-y-3">
            {data.paymentBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{item._id || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{item.count} orders</p>
                </div>
                <span className="text-sm font-bold text-gray-900">₹{item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          Last 7 Days Trend
        </h2>
        <div className="space-y-2">
          {data.recentTrend.map((item, idx) => {
            const maxRevenue = Math.max(...data.recentTrend.map(t => t.revenue), 1);
            return (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 w-24">{item._id}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">₹{item.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{item.orders} orders</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};