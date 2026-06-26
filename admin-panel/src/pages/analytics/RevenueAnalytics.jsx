import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { TrendingUp, DollarSign, ShoppingCart, Percent } from 'lucide-react';

export const RevenueAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => { loadData(); }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getRevenueAnalytics({ period });
      setData(result);
    } catch (error) {
      console.error('Failed to load revenue analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const maxRevenue = Math.max(...data.data.map(d => d.revenue), 1);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${data.summary.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-4 h-4 text-green-400" />,
      iconBg: 'bg-green-500/20',
      valueColor: 'text-green-400',
    },
    {
      label: 'Net Revenue',
      value: `₹${data.summary.netRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      valueColor: 'text-blue-400',
    },
    {
      label: 'Commission (10%)',
      value: `₹${data.summary.totalCommission.toLocaleString()}`,
      icon: <Percent className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/20',
      valueColor: 'text-purple-400',
    },
    {
      label: 'Total Orders',
      value: data.summary.totalOrders,
      icon: <ShoppingCart className="w-4 h-4 text-orange-400" />,
      iconBg: 'bg-orange-500/20',
      valueColor: 'text-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(37, 99, 235, 0.22), 0 4px 12px -2px rgba(37,99,235,0.12);
        }
        .bar-3d-track {
          background: linear-gradient(to bottom, #BFDBFE, #DBEAFE);
          border-radius: 999px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.10), inset 0 -1px 2px rgba(255,255,255,0.7);
          position: relative;
          overflow: visible;
        }
        .bar-3d-fill {
          border-radius: 999px;
          background: linear-gradient(90deg, #1D4ED8, #3B82F6);
          box-shadow:
            0 -2px 0 rgba(255,255,255,0.2) inset,
            0 3px 8px rgba(59, 130, 246, 0.45),
            0 1px 0 #1E40AF;
          position: relative;
          transition: width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bar-3d-fill::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 6px;
          right: 6px;
          height: 35%;
          background: rgba(255,255,255,0.28);
          border-radius: 999px;
        }
        .revenue-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
        }
        .revenue-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #3B82F6;
        }
        .period-btn {
          transition: all 0.2s ease;
        }
        .period-btn.active {
          background: white;
          color: #1D4ED8;
          box-shadow: 0 2px 8px rgba(37,99,235,0.18), 0 1px 3px rgba(37,99,235,0.1);
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Analytics</h1>
              <p className="text-blue-300/70 text-sm mt-1">Track platform revenue and commission trends</p>
            </div>

            {/* Period toggle — pill style */}
            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl p-1 self-start mt-1">
              {['daily', 'weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`period-btn px-4 py-1.5 text-xs font-bold rounded-lg capitalize text-blue-200 ${period === p ? 'active' : 'hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-3d bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
                <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-5 border-b border-blue-50 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(37,99,235,0.13), 0 1px 3px rgba(37,99,235,0.08)' }}
            >
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Revenue Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{period} breakdown — {data.data.length} periods</p>
            </div>
          </div>

          <div className="p-6">
            {data.data.length > 0 ? (
              <div className="space-y-4">
                {data.data.map((item, idx) => {
                  const pct = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={idx} className="revenue-row p-1">
                      <div className="flex items-center gap-4">

                        {/* Period label */}
                        <span className="text-xs font-semibold text-gray-400 w-20 shrink-0 text-right">
                          {item.period}
                        </span>

                        {/* 3D Bar */}
                        <div className="flex-1">
                          <div className="bar-3d-track h-7 w-full">
                            <div
                              className="bar-3d-fill h-full flex items-center justify-end pr-3"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            >
                              {pct > 18 && (
                                <span className="text-xs text-white font-bold relative z-10">
                                  ₹{item.revenue.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Revenue (if bar too short to show inside) */}
                        <div className="w-32 shrink-0 text-right">
                          {pct <= 18 && (
                            <span className="text-xs font-bold text-blue-700">
                              ₹{item.revenue.toLocaleString()}
                            </span>
                          )}
                          {pct > 18 && (
                            <span className="text-xs font-bold text-blue-700">
                              ₹{item.revenue.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Orders badge */}
                        <div className="shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100">
                            <ShoppingCart className="w-3 h-3" />
                            {item.orders}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div
                  className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3"
                  style={{ boxShadow: '0 4px 12px rgba(37,99,235,0.10)' }}
                >
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <p className="text-sm font-medium text-gray-400">No revenue data for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};