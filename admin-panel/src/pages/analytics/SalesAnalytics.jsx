import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Calendar } from 'lucide-react';

export const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getSalesAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load sales analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const GrowthBadge = ({ value }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      value >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {value >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
      {Math.abs(value)}%
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time sales performance overview.</p>
      </div>

      {/* Today's Stats */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-bold">Today's Performance</h2>
          </div>
          <span className="text-sm opacity-90">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Revenue</p>
            <p className="text-3xl font-bold">₹{data.today.revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Orders</p>
            <p className="text-3xl font-bold">{data.today.orders}</p>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">₹{data.thisMonth.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{data.thisMonth.orders} orders</p>
            </div>
            <GrowthBadge value={data.growth.revenue} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last Month</h3>
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{data.lastMonth.revenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{data.lastMonth.orders} orders</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <DollarSign className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-xs text-gray-500">Avg Order Value</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{data.thisMonth.orders > 0 ? Math.round(data.thisMonth.revenue / data.thisMonth.orders).toLocaleString() : 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <ShoppingCart className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-lg font-bold text-gray-900">{data.thisMonth.orders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-xs text-gray-500">Revenue Growth</p>
          <p className={`text-lg font-bold ${data.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.growth.revenue}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-xs text-gray-500">Today's Orders</p>
          <p className="text-lg font-bold text-gray-900">{data.today.orders}</p>
        </div>
      </div>
    </div>
  );
};