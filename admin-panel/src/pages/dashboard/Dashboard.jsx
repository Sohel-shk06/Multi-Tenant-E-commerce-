

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchRevenueChartData, fetchTopVendors } from '../../app/store/analyticsSlice';
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Store, Download, Plus, TrendingUp, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenueChartData, topVendors, isLoading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchRevenueChartData('monthly'));
    dispatch(fetchTopVendors(5));
  }, [dispatch]);

  if (isLoading && !stats) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
        <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="font-semibold text-lg" style={{ color: '#312E81' }}>Dashboard unavailable</p>
          <p className="text-sm mt-1 text-gray-500">Failed to load data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const vendorColors = [
    { bar: '#6366F1', bg: '#EEF2FF', text: '#4338CA' },
    { bar: '#818CF8', bg: '#EEF2FF', text: '#4338CA' },
    { bar: '#4338CA', bg: '#C7D2FE', text: '#312E81' },
    { bar: '#312E81', bg: '#C7D2FE', text: '#1E1B4B' },
    { bar: '#1E1B4B', bg: '#EEF2FF', text: '#312E81' },
  ];

  const now = new Date();
  const timeString = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FF' }}>

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #6366F1, #4338CA, #312E81)' }} />

      <div className="px-6 py-8 max-w-screen-2xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border"
                style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
              >
                <Sparkles className="w-3 h-3" />
                Live Overview
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1E1B4B' }}>
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400">{timeString}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border bg-white transition-all shadow-sm hover:bg-gray-50"
              style={{ color: '#4338CA', borderColor: '#C7D2FE' }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all shadow-md"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Charts & Vendors */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#C7D2FE' }}>
            <div className="px-6 pt-6 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid #EEF2FF' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #312E81)', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}
                >
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: '#1E1B4B' }}>Revenue Overview</h2>
                  <p className="text-xs text-gray-400">Track platform earnings over time</p>
                </div>
              </div>
              <select
                defaultValue="monthly"
                onChange={(e) => dispatch(fetchRevenueChartData(e.target.value))}
                className="text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer transition-all"
                style={{
                  color: '#4338CA',
                  backgroundColor: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                }}
              >
                <option value="daily">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="yearly">Last 12 Months</option>
              </select>
            </div>
            <div className="p-6">
              <RevenueChart data={revenueChartData} />
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#C7D2FE' }}>
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #EEF2FF' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #818CF8, #4338CA)', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}
                >
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: '#1E1B4B' }}>Top Vendors</h2>
                  <p className="text-xs text-gray-400">Ranked by revenue this month</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {topVendors && topVendors.length > 0 ? (
                <div className="space-y-5">
                  {topVendors.map((vendor, idx) => {
                    const c = vendorColors[idx % vendorColors.length];
                    const maxSales = topVendors[0]?.totalSales || 1;
                    const pct = Math.round((vendor.totalSales / maxSales) * 100);

                    return (
                      <div key={vendor._id?._id || idx}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center"
                              style={{ backgroundColor: c.bg, color: c.text }}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium truncate max-w-[130px]" style={{ color: '#1E1B4B' }}>
                              {vendor._id?.name || 'Unknown Vendor'}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold" style={{ color: '#312E81' }}>
                              ₹{vendor.totalSales?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EEF2FF' }}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: c.bar }}
                            />
                          </div>
                          <span className="text-[11px] text-gray-400 w-8 text-right">{vendor.totalOrders}x</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border border-dashed"
                    style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
                  >
                    <Store className="w-6 h-6" style={{ color: '#818CF8' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#4338CA' }}>No sales yet this month</p>
                  <p className="text-xs text-gray-400 mt-1">Top vendors will appear here after sales</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};