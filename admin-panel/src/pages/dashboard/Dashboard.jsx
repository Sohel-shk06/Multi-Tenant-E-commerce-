import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchRevenueChartData } from '../../app/store/analyticsSlice';
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PageLoader } from '../../components/loaders/PageLoader';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenueChartData, isLoading, error } = useSelector((state) => state.analytics);

  // Page load hote hi data fetch karein
  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchRevenueChartData('monthly'));
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

      {/* Stats Grid (Top Cards) */}
      <DashboardStats stats={stats} />

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart (Takes 2/3 width on large screens) */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select 
  defaultValue="Last 30 Days"
  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
>
  <option value="Last 7 Days">Last 7 Days</option>
  <option value="Last 30 Days">Last 30 Days</option>
  <option value="Last 12 Months">Last 12 Months</option>
</select>
          </div>
          <RevenueChart data={revenueChartData} />
        </div>

        {/* Top Vendors List (Takes 1/3 width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Vendors</h2>
          <div className="space-y-5">
            {/* Dummy Data for Top Vendors (Backend se replace hoga) */}
            {[
              { name: 'TechStore Pro', sales: '₹1,25,000', color: 'bg-blue-500' },
              { name: 'Fashion Hub', sales: '₹98,500', color: 'bg-purple-500' },
              { name: 'Home Essentials', sales: '₹75,200', color: 'bg-green-500' },
              { name: 'Gadget World', sales: '₹54,000', color: 'bg-orange-500' },
            ].map((vendor, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded-full ${vendor.color}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">{vendor.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};