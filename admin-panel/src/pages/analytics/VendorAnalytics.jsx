import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { Store, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';

export const VendorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

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
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const maxRevenue = Math.max(...data.topVendors.map(v => v.totalRevenue), 1);

  const stats = [
    {
      label: 'Total Vendors',
      value: data.summary.totalVendors,
      icon: <Store className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/20',
      valueColor: 'text-white',
      accent: '#7C3AED',
    },
    {
      label: 'Active',
      value: data.summary.activeVendors,
      icon: <UserCheck className="w-4 h-4 text-green-400" />,
      iconBg: 'bg-green-500/20',
      valueColor: 'text-green-400',
      accent: '#16A34A',
    },
    {
      label: 'Pending',
      value: data.summary.pendingVendors,
      icon: <Clock className="w-4 h-4 text-yellow-400" />,
      iconBg: 'bg-yellow-500/20',
      valueColor: 'text-yellow-400',
      accent: '#CA8A04',
    },
    {
      label: 'Suspended',
      value: data.summary.suspendedVendors,
      icon: <UserX className="w-4 h-4 text-red-400" />,
      iconBg: 'bg-red-500/20',
      valueColor: 'text-red-400',
      accent: '#DC2626',
    },
    {
      label: 'New This Month',
      value: data.summary.newVendorsThisMonth,
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      valueColor: 'text-blue-400',
      accent: '#2563EB',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(109, 40, 217, 0.25), 0 4px 12px -2px rgba(109,40,217,0.15);
        }
        .bar-3d-track {
          background: linear-gradient(to bottom, #e9d5ff, #ddd6fe);
          border-radius: 999px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.6);
          position: relative;
          overflow: visible;
        }
        .bar-3d-fill {
          border-radius: 999px;
          background: linear-gradient(90deg, #7C3AED, #9333EA);
          box-shadow:
            0 -2px 0 rgba(255,255,255,0.25) inset,
            0 3px 8px rgba(124, 58, 237, 0.45),
            0 1px 0 #5B21B6 ;
          position: relative;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bar-3d-fill::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 6px;
          right: 6px;
          height: 35%;
          background: rgba(255,255,255,0.3);
          border-radius: 999px;
        }
        .vendor-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .vendor-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #7C3AED;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vendor Analytics</h1>
          <p className="text-purple-300/70 text-sm mt-1">Overview of vendor performance and growth</p>

          {/* 3D Stats Cards inside header */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-3d bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-purple-300/70 font-medium uppercase tracking-wider">{s.label}</span>
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

        {/* Top Vendors */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-5 border-b border-purple-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(124,58,237,0.15), 0 1px 3px rgba(124,58,237,0.1)' }}>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Top Vendors by Revenue</h2>
              <p className="text-xs text-gray-400 mt-0.5">{data.topVendors.length} vendors ranked</p>
            </div>
          </div>

          <div className="p-6">
            {data.topVendors.length > 0 ? (
              <div className="space-y-5">
                {data.topVendors.map((vendor, idx) => {
                  const pct = (vendor.totalRevenue / maxRevenue) * 100;
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={idx} className="vendor-row rounded-xl p-1">
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
                            background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                            boxShadow: '0 4px 12px rgba(124,58,237,0.35), 0 1px 3px rgba(124,58,237,0.2)',
                          }}
                        >
                          {vendor._id?.name?.[0]?.toUpperCase() || 'V'}
                        </div>

                        {/* Name + orders */}
                        <div className="w-36 shrink-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{vendor._id?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{vendor.totalOrders} orders</p>
                        </div>

                        {/* 3D Bar */}
                        <div className="flex-1">
                          <div className="bar-3d-track h-5 w-full">
                            <div
                              className="bar-3d-fill h-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Revenue */}
                        <div className="w-28 text-right shrink-0">
                          <span className="text-sm font-bold text-purple-700">
                            ₹{vendor.totalRevenue.toLocaleString()}
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
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3"
                  style={{ boxShadow: '0 4px 12px rgba(124,58,237,0.12)' }}>
                  <Store className="w-6 h-6 text-purple-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">No vendor data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};