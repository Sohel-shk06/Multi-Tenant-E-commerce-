import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Calendar } from 'lucide-react';

export const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getSalesAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load sales analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const isPositive = data.growth.revenue >= 0;

  const GrowthBadge = ({ value }) => (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
      value >= 0
        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
        : 'bg-red-500/20 text-red-400 border border-red-500/30'
    }`}>
      {value >= 0
        ? <TrendingUp className="w-3 h-3" />
        : <TrendingDown className="w-3 h-3" />}
      {Math.abs(value)}%
    </span>
  );

  const summaryCards = [
    {
      icon: <DollarSign className="w-4 h-4 text-green-400" />,
      iconBg: 'bg-green-500/20',
      label: 'Avg Order Value',
      value: `₹${data.thisMonth.orders > 0 ? Math.round(data.thisMonth.revenue / data.thisMonth.orders).toLocaleString() : 0}`,
      valueColor: 'text-white',
    },
    {
      icon: <ShoppingCart className="w-4 h-4 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      label: 'Total Orders',
      value: data.thisMonth.orders,
      valueColor: 'text-blue-400',
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/20',
      label: 'Revenue Growth',
      value: `${data.growth.revenue}%`,
      valueColor: isPositive ? 'text-green-400' : 'text-red-400',
    },
    {
      icon: <Calendar className="w-4 h-4 text-orange-400" />,
      iconBg: 'bg-orange-500/20',
      label: "Today's Orders",
      value: data.today.orders,
      valueColor: 'text-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(234,88,12,0.22), 0 4px 12px -2px rgba(234,88,12,0.12);
        }
        .month-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .month-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(234,88,12,0.13), 0 4px 8px rgba(234,88,12,0.08);
        }
        .today-glow {
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.15),
            0 8px 32px rgba(234,88,12,0.35),
            0 2px 8px rgba(234,88,12,0.2);
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales Analytics</h1>
          <p className="text-orange-300/70 text-sm mt-1">Real-time sales performance overview</p>

          {/* Today's Performance — hero inside header */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 today-glow">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-300" />
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Today's Performance</h2>
              </div>
              <span className="text-xs text-orange-300/70 font-medium">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-orange-300/70 font-medium uppercase tracking-wider mb-1">Revenue</p>
                <p className="text-4xl font-bold text-white">₹{data.today.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-orange-300/70 font-medium uppercase tracking-wider mb-1">Orders</p>
                <p className="text-4xl font-bold text-orange-400">{data.today.orders}</p>
              </div>
            </div>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {summaryCards.map((s) => (
              <div
                key={s.label}
                className="card-3d bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-orange-300/70 font-medium uppercase tracking-wider">{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
                <p className={`text-xl font-bold ${s.valueColor}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* This Month */}
          <div className="month-card bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden cursor-default">
            <div className="px-6 py-5 border-b border-orange-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"
                style={{ boxShadow: '0 4px 10px rgba(234,88,12,0.13)' }}>
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">This Month</h2>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">₹{data.thisMonth.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg border border-orange-100">
                      <ShoppingCart className="w-3 h-3" />
                      {data.thisMonth.orders} orders
                    </span>
                  </div>
                </div>
                {/* Growth vs last month */}
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1.5">vs last month</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    isPositive
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {isPositive
                      ? <TrendingUp className="w-3 h-3" />
                      : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(data.growth.revenue)}%
                  </span>
                </div>
              </div>

              {/* Mini visual bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>This month</span>
                  <span>vs last month</span>
                </div>
                <div className="relative h-3 bg-orange-50 rounded-full border border-orange-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((data.thisMonth.revenue / Math.max(data.thisMonth.revenue, data.lastMonth.revenue)) * 100, 100)}%`,
                      background: 'linear-gradient(90deg,#C2410C,#F97316)',
                      boxShadow: '0 2px 6px rgba(249,115,22,0.4), 0 1px 0 #9A3412',
                    }}
                  />
                </div>
                <div className="relative h-3 bg-gray-50 rounded-full border border-gray-100 overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((data.lastMonth.revenue / Math.max(data.thisMonth.revenue, data.lastMonth.revenue)) * 100, 100)}%`,
                      background: 'linear-gradient(90deg,#9CA3AF,#D1D5DB)',
                      boxShadow: '0 2px 6px rgba(156,163,175,0.3)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Last Month */}
          <div className="month-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-default">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"
                style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Last Month</h2>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-gray-900">₹{data.lastMonth.revenue.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-lg border border-gray-100">
                  <ShoppingCart className="w-3 h-3" />
                  {data.lastMonth.orders} orders
                </span>
              </div>

              {/* Order growth badge */}
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Order Growth</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    data.growth.orders >= 0
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {data.growth.orders >= 0
                      ? <TrendingUp className="w-3 h-3" />
                      : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(data.growth.orders)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {data.thisMonth.orders > data.lastMonth.orders
                    ? `+${data.thisMonth.orders - data.lastMonth.orders} more orders this month`
                    : `${data.lastMonth.orders - data.thisMonth.orders} fewer orders this month`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};