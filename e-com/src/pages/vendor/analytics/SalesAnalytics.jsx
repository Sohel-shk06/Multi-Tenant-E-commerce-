import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Calendar } from 'lucide-react';

export const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getSalesAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load sales analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const GrowthBadge = ({ value }) => (
    <span className={`inline-flex items-center text-xs font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
      {value >= 0 ? '+' : ''}{value}% vs last month
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Quick snapshot of your sales performance.</p>
      </div>

      {/* Today's Stats */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Today's Sales</p>
            <p className="text-3xl font-bold mt-1">₹{data.today.revenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
        <p className="text-blue-100 text-sm">{data.today.orders} orders today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* This Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">This Month</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">₹{data.thisMonth.revenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mb-3">{data.thisMonth.orders} orders</p>
          <GrowthBadge value={data.growth.revenue} />
        </div>

        {/* Last Month Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Last Month</h3>
            <div className="p-2 bg-gray-50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">₹{data.lastMonth.revenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mb-3">{data.lastMonth.orders} orders</p>
          <GrowthBadge value={data.growth.orders} />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">Revenue Growth</p>
            <p className={`text-2xl font-bold ${data.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth.revenue >= 0 ? '+' : ''}{data.growth.revenue}%
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 mb-2">Orders Growth</p>
            <p className={`text-2xl font-bold ${data.growth.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth.orders >= 0 ? '+' : ''}{data.growth.orders}%
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{data.thisMonth.orders > 0 ? Math.round(data.thisMonth.revenue / data.thisMonth.orders).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};