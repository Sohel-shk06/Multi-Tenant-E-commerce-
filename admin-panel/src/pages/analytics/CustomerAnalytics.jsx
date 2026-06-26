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
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const maxSpent = Math.max(...data.topCustomers.map(c => c.totalSpent), 1);
  const maxCount = Math.max(...data.acquisitionTrend.map(t => t.count), 1);
  const medals = ['🥇', '🥈', '🥉'];

  const stats = [
    {
      label: 'Total Customers',
      value: data.summary.totalCustomers,
      icon: <Users className="w-4 h-4 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      valueColor: 'text-white',
    },
    {
      label: 'Active (30 days)',
      value: data.summary.activeCustomers,
      icon: <UserCheck className="w-4 h-4 text-green-400" />,
      iconBg: 'bg-green-500/20',
      valueColor: 'text-green-400',
    },
    {
      label: 'New This Month',
      value: data.summary.newCustomersThisMonth,
      icon: <UserPlus className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/20',
      valueColor: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(22,163,74,0.22), 0 4px 12px -2px rgba(22,163,74,0.12);
        }
        .bar-track {
          border-radius: 999px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.10), inset 0 -1px 2px rgba(255,255,255,0.7);
          background: #DCFCE7;
          overflow: visible;
        }
        .bar-fill-green {
          border-radius: 999px;
          background: linear-gradient(90deg, #15803D, #22C55E);
          box-shadow: 0 3px 8px rgba(34,197,94,0.45), 0 1px 0 #14532D;
          position: relative;
          transition: width 0.9s cubic-bezier(0.34,1.56,0.64,1);
        }
        .bar-fill-green::after {
          content: '';
          position: absolute;
          top: 2px; left: 6px; right: 6px;
          height: 35%;
          background: rgba(255,255,255,0.28);
          border-radius: 999px;
        }
        .customer-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
        }
        .customer-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #22C55E;
        }
        .trend-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
        }
        .trend-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #22C55E;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customer Analytics</h1>
          <p className="text-green-300/70 text-sm mt-1">Customer insights and acquisition trends</p>

          {/* 3D Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-3d bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-green-300/70 font-medium uppercase tracking-wider">{s.label}</span>
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
      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">

        {/* Acquisition Trend */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-green-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(22,163,74,0.13)' }}>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Customer Acquisition Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">{data.acquisitionTrend.length} periods</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {data.acquisitionTrend.map((item, idx) => {
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="trend-row p-1">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 text-right">{item._id}</span>
                    <div className="flex-1">
                      <div className="bar-track h-7 w-full">
                        <div
                          className="bar-fill-green h-full flex items-center justify-end pr-3"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        >
                          {pct > 18 && (
                            <span className="text-xs text-white font-bold relative z-10">{item.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100 shrink-0">
                      <UserPlus className="w-3 h-3" />
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-green-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(22,163,74,0.13)' }}>
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Top Customers by Spending</h2>
              <p className="text-xs text-gray-400 mt-0.5">{data.topCustomers.length} customers ranked</p>
            </div>
          </div>
          <div className="p-6">
            {data.topCustomers.length > 0 ? (
              <div className="space-y-5">
                {data.topCustomers.map((customer, idx) => {
                  const pct = (customer.totalSpent / maxSpent) * 100;
                  return (
                    <div key={idx} className="customer-row p-1">
                      <div className="flex items-center gap-4">

                        {/* Rank */}
                        <div className="w-8 text-center shrink-0">
                          {idx < 3
                            ? <span className="text-xl">{medals[idx]}</span>
                            : <span className="text-sm font-bold text-gray-300">#{idx + 1}</span>
                          }
                        </div>

                        {/* Avatar */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #15803D, #22C55E)',
                            boxShadow: '0 4px 12px rgba(34,197,94,0.35), 0 1px 3px rgba(34,197,94,0.2)',
                          }}
                        >
                          {customer._id?.name?.[0]?.toUpperCase() || 'C'}
                        </div>

                        {/* Name + orders */}
                        <div className="w-36 shrink-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{customer._id?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{customer.orderCount} orders</p>
                        </div>

                        {/* 3D Bar */}
                        <div className="flex-1">
                          <div className="bar-track h-5 w-full">
                            <div
                              className="bar-fill-green h-full"
                              style={{ width: `${Math.max(pct, 3)}%` }}
                            />
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="w-28 text-right shrink-0">
                          <span className="text-sm font-bold text-green-700">
                            ₹{customer.totalSpent.toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-400 mt-0.5">{pct.toFixed(0)}% of top</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3"
                  style={{ boxShadow: '0 4px 12px rgba(22,163,74,0.10)' }}>
                  <Users className="w-6 h-6 text-green-200" />
                </div>
                <p className="text-sm font-medium text-gray-400">No customer data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};