import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { Users, TrendingUp, UserCheck, Award } from 'lucide-react';

export const CustomerAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getCustomerAnalytics();
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Understand your customer base and behavior.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Customers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Repeat Customers</span>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.repeatCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Repeat Rate</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{data.repeatRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">New (Last 6mo)</span>
            <Award className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.acquisitionTrend.reduce((sum, t) => sum + t.newCustomers, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Top Customers by Spending
          </h2>
          {data.topCustomers.length > 0 ? (
            <div className="space-y-3">
              {data.topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer._id?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{customer._id?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{customer._id?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No customers yet.</p>
          )}
        </div>

        {/* Customer Acquisition Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Acquisition (Last 6 Months)</h2>
          {data.acquisitionTrend.length > 0 ? (
            <div className="space-y-3">
              {data.acquisitionTrend.map((item, idx) => {
                const maxCustomers = Math.max(...data.acquisitionTrend.map(t => t.newCustomers), 1);
                return (
                  <div key={idx} className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-20">{item.period}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-end pr-2"
                        style={{ width: `${(item.newCustomers / maxCustomers) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{item.newCustomers}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-20 text-right">new customers</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No acquisition data available.</p>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Customer Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• You have <strong>{data.repeatRate}%</strong> repeat customer rate - {data.repeatRate > 30 ? 'Excellent!' : data.repeatRate > 15 ? 'Good, but can be improved.' : 'Focus on customer retention!'}</li>
          <li>• Total of <strong>{data.totalCustomers}</strong> unique customers have purchased from your store.</li>
          <li>• Your top customer has spent <strong>₹{data.topCustomers[0]?.totalSpent.toLocaleString() || 0}</strong> with you.</li>
        </ul>
      </div>
    </div>
  );
};