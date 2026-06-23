import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchRevenueChartData, fetchTopVendors } from '../../app/store/analyticsSlice';
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Download, Plus, TrendingUp, Store } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenueChartData, topVendors, isLoading, error } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchRevenueChartData('monthly'));
    dispatch(fetchTopVendors(5));
  }, [dispatch]);

  if (isLoading && !stats) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl border border-gray-200 max-w-sm">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="font-semibold text-gray-900">Dashboard unavailable</p>
          <p className="text-sm mt-1 text-gray-400">Failed to load data. Please try again.</p>
        </div>
      </div>
    );
  }

  const vendorColors = ['#4338CA', '#6366F1', '#312E81', '#818CF8', '#1E1B4B'];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border border-gray-200 bg-white text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>

          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#4338CA' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4338CA'}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#4338CA' }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">Revenue overview</p>
                  <p className="text-[11px] text-gray-400">Platform earnings over time</p>
                </div>
              </div>
              <select
                defaultValue="monthly"
                onChange={(e) => dispatch(fetchRevenueChartData(e.target.value))}
                className="text-[11px] font-medium rounded-md px-2.5 py-1.5 focus:outline-none cursor-pointer border"
                style={{ color: '#4338CA', backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
              >
                <option value="daily">Last 7 days</option>
                <option value="monthly">Last 30 days</option>
                <option value="yearly">Last 12 months</option>
              </select>
            </div>
            <div className="p-5">
              <RevenueChart data={revenueChartData} />
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Top vendors</p>
                <p className="text-[11px] text-gray-400">By revenue this month</p>
              </div>
            </div>

            <div className="p-5">
              {topVendors && topVendors.length > 0 ? (
                <div>
                  {topVendors.map((vendor, idx) => {
                    const maxSales = topVendors[0]?.totalSales || 1;
                    const pct = Math.round((vendor.totalSales / maxSales) * 100);
                    const barColor = vendorColors[idx % vendorColors.length];
                    return (
                      <div key={vendor._id?._id || idx} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
                        <div className="w-[22px] h-[22px] rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-gray-900 truncate">
                            {vendor._id?.name || 'Unknown Vendor'}
                          </p>
                          <div className="mt-1 h-[3px] rounded-full bg-gray-100 overflow-hidden w-full">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[12px] font-semibold text-gray-900">₹{vendor.totalSales?.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">{vendor.totalOrders} orders</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-3">
                    <Store className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-[13px] font-medium text-gray-500">No sales yet</p>
                  <p className="text-[11px] text-gray-400 mt-1">Top vendors will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};