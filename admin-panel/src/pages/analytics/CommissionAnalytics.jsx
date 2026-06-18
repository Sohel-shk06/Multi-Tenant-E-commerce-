import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { DollarSign, Percent, TrendingUp } from 'lucide-react';

export const CommissionAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getCommissionAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load commission analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    earned: 'bg-green-100 text-green-800',
    collected: 'bg-blue-100 text-blue-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commission Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Platform commission earnings and trends.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <DollarSign className="w-6 h-6 mb-2" />
          <p className="text-sm opacity-90">Total Commission</p>
          <p className="text-3xl font-bold">₹{data.summary.totalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <Percent className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-3xl font-bold text-gray-900">{data.summary.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Avg Commission</p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{data.summary.totalTransactions > 0 ? Math.round(data.summary.totalCommission / data.summary.totalTransactions).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Commission Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.statusBreakdown.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${statusColors[item._id] || 'bg-gray-100 text-gray-800'}`}>
                {item._id?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-500">₹{item.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Commission Trend</h2>
        <div className="space-y-2">
          {data.monthlyTrend.map((item, idx) => {
            const maxCommission = Math.max(...data.monthlyTrend.map(t => t.commission), 1);
            return (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 w-20">{item._id}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.commission / maxCommission) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">₹{item.commission.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{item.count} txns</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};