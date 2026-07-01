import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { TrendingUp, DollarSign, TrendingDown, Calendar } from 'lucide-react';

export const RevenueAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await vendorService.getRevenueAnalytics({ period });
      setData(result);
    } catch (error) {
      console.error('Failed to load revenue analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const maxRevenue = Math.max(...data.data.map(d => d.revenue), 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue growth over time.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                period === p ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="overflow-x-auto hide-scrollbar">
      <div className="grid grid-cols-4 min-w-[700px] gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{data.summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Orders</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Avg Order Value</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{data.summary.avgOrderValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Growth Rate</span>
            {data.summary.growthRate >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${data.summary.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.summary.growthRate >= 0 ? '+' : ''}{data.summary.growthRate}%
          </p>
        </div>
      </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h2>
        <div className="space-y-3">
          {data.data.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 w-24">{item.period}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-lg transition-all flex items-center justify-end pr-2"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">₹{item.revenue.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500 w-20 text-right">{item.orders} orders</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};