import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';

export const CustomerAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getCustomerAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load customer analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const maxSpent = Math.max(...data.topCustomers.map(c => c.totalSpent), 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Customer insights and acquisition trends.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Customers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Active (30 days)</span>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{data.summary.activeCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">New This Month</span>
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{data.summary.newCustomersThisMonth}</p>
        </div>
      </div>

      {/* Acquisition Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Customer Acquisition Trend
        </h2>
        <div className="space-y-2">
          {data.acquisitionTrend.map((item, idx) => {
            const maxCount = Math.max(...data.acquisitionTrend.map(t => t.count), 1);
            return (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 w-20">{item._id}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers by Spending</h2>
        {data.topCustomers.length > 0 ? (
          <div className="space-y-3">
            {data.topCustomers.map((customer, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">{customer._id?.name?.[0] || 'C'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{customer._id?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                    style={{ width: `${(customer.totalSpent / maxSpent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-24 text-right">
                  ₹{customer.totalSpent.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No customer data available.</p>
        )}
      </div>
    </div>
  );
};