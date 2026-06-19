import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { Store, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';

export const VendorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getVendorAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load vendor analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const maxRevenue = Math.max(...data.topVendors.map(v => v.totalRevenue), 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of vendor performance and growth.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Total Vendors</span>
            <Store className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{data.summary.totalVendors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Active</span>
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-600">{data.summary.activeVendors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Pending</span>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-xl font-bold text-yellow-600">{data.summary.pendingVendors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Suspended</span>
            <UserX className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-red-600">{data.summary.suspendedVendors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">New This Month</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-blue-600">{data.summary.newVendorsThisMonth}</p>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Vendors by Revenue</h2>
        {data.topVendors.length > 0 ? (
          <div className="space-y-3">
            {data.topVendors.map((vendor, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">{vendor._id?.name?.[0] || 'V'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{vendor._id?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{vendor.totalOrders} orders</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full"
                    style={{ width: `${(vendor.totalRevenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-24 text-right">
                  ₹{vendor.totalRevenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No vendor data available.</p>
        )}
      </div>
    </div>
  );
};