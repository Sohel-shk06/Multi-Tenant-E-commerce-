import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchRevenueChartData, fetchTopVendors } from '../../app/store/analyticsSlice';
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Store } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenueChartData, topVendors, isLoading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchRevenueChartData('monthly'));
    dispatch(fetchTopVendors(5)); // ✅ REAL DATA FETCH
  }, [dispatch]);

  if (isLoading && !stats) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening on your platform today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Vendor
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select 
              defaultValue="monthly"
              onChange={(e) => dispatch(fetchRevenueChartData(e.target.value))}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
              <option value="yearly">Last 12 Months</option>
            </select>
          </div>
          <RevenueChart data={revenueChartData} />
        </div>

        {/* ✅ REAL TOP VENDORS - NO DUMMY DATA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Store className="w-5 h-5 mr-2 text-purple-600" />
            Top Vendors (This Month)
          </h2>
          
          {topVendors && topVendors.length > 0 ? (
            <div className="space-y-5">
              {topVendors.map((vendor, idx) => (
                <div key={vendor._id?._id || idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-8 rounded-full ${colors[idx % colors.length]}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor._id?.name || 'Unknown Vendor'}
                      </p>
                      <p className="text-xs text-gray-500">{vendor.totalOrders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{vendor.totalSales?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No vendor sales yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Top vendors will appear here after sales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};