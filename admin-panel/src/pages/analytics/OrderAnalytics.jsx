import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';

export const OrderAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getOrderAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load order analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F1FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#F0F1FF] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const statusConfig = {
    pending:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', bar: 'linear-gradient(90deg,#CA8A04,#EAB308)', shadow: 'rgba(234,179,8,0.4)' },
    confirmed: { bg: 'bg-blue-500/20',   text: 'text-blue-400',   bar: 'linear-gradient(90deg,#1D4ED8,#3B82F6)', shadow: 'rgba(59,130,246,0.4)' },
    shipped:   { bg: 'bg-purple-500/20', text: 'text-purple-400', bar: 'linear-gradient(90deg,#7C3AED,#A855F7)', shadow: 'rgba(168,85,247,0.4)' },
    delivered: { bg: 'bg-green-500/20',  text: 'text-green-400',  bar: 'linear-gradient(90deg,#15803D,#22C55E)', shadow: 'rgba(34,197,94,0.4)' },
    completed: { bg: 'bg-emerald-500/20',text: 'text-emerald-400',bar: 'linear-gradient(90deg,#059669,#10B981)', shadow: 'rgba(16,185,129,0.4)' },
    cancelled: { bg: 'bg-red-500/20',    text: 'text-red-400',    bar: 'linear-gradient(90deg,#DC2626,#EF4444)', shadow: 'rgba(239,68,68,0.4)' },
  };

  const maxCount   = Math.max(...data.statusBreakdown.map(s => s.count), 1);
  const maxRevenue = Math.max(...data.recentTrend.map(t => t.revenue), 1);

  return (
    <div className="min-h-screen bg-[#F0F1FF]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(79,70,229,0.22), 0 4px 12px -2px rgba(79,70,229,0.12);
        }
        .bar-track {
          border-radius: 999px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.10), inset 0 -1px 2px rgba(255,255,255,0.7);
          background: #E0E7FF;
          overflow: visible;
        }
        .bar-fill {
          border-radius: 999px;
          position: relative;
          transition: width 0.9s cubic-bezier(0.34,1.56,0.64,1);
        }
        .bar-fill::after {
          content: '';
          position: absolute;
          top: 2px; left: 6px; right: 6px;
          height: 35%;
          background: rgba(255,255,255,0.28);
          border-radius: 999px;
        }
        .status-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
        }
        .status-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #6366F1;
        }
        .trend-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
        }
        .trend-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 #6366F1;
        }
        .payment-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .payment-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(79,70,229,0.13);
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Order Analytics</h1>
          <p className="text-indigo-300/70 text-sm mt-1">Order trends and status breakdown</p>

          {/* Total Orders — hero stat */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 inline-flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center"
              style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              <ShoppingCart className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-indigo-300/70 font-medium uppercase tracking-wider">Total Orders</p>
              <p className="text-4xl font-bold text-white mt-0.5">{data.summary.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-indigo-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center"
                style={{ boxShadow: '0 4px 10px rgba(79,70,229,0.13)' }}>
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Status Breakdown</h2>
                <p className="text-xs text-gray-400 mt-0.5">{data.statusBreakdown.length} statuses</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {data.statusBreakdown.map((item, idx) => {
                const cfg = statusConfig[item._id] || statusConfig.pending;
                const pct = (item.count / maxCount) * 100;
                return (
                  <div key={idx} className="status-row p-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                        {item._id?.charAt(0).toUpperCase() + item._id?.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto font-semibold">{item.count} orders</span>
                    </div>
                    <div className="bar-track h-5 w-full">
                      <div
                        className="bar-fill h-full"
                        style={{
                          width: `${Math.max(pct, 3)}%`,
                          background: cfg.bar,
                          boxShadow: `0 3px 8px ${cfg.shadow}, 0 1px 0 rgba(0,0,0,0.15)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-indigo-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"
                style={{ boxShadow: '0 4px 10px rgba(22,163,74,0.13)' }}>
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Payment Methods</h2>
                <p className="text-xs text-gray-400 mt-0.5">{data.paymentBreakdown.length} methods</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {data.paymentBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="payment-card flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-xl cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-indigo-100 flex items-center justify-center"
                      style={{ boxShadow: '0 2px 6px rgba(79,70,229,0.10)' }}>
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 capitalize">{item._id || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.count} orders</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100"
                    style={{ boxShadow: '0 2px 6px rgba(79,70,229,0.08)' }}>
                    ₹{item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last 7 Days Trend */}
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-indigo-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(79,70,229,0.13)' }}>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Last 7 Days Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily revenue and order volume</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {data.recentTrend.map((item, idx) => {
              const pct = (item.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="trend-row p-1">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 text-right">{item._id}</span>
                    <div className="flex-1">
                      <div className="bar-track h-7 w-full">
                        <div
                          className="bar-fill h-full flex items-center justify-end pr-3"
                          style={{
                            width: `${Math.max(pct, 4)}%`,
                            background: 'linear-gradient(90deg,#4338CA,#6366F1)',
                            boxShadow: '0 3px 8px rgba(99,102,241,0.40), 0 1px 0 #3730A3',
                          }}
                        >
                          {pct > 20 && (
                            <span className="text-xs text-white font-bold relative z-10">
                              ₹{item.revenue.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 w-28 shrink-0 text-right">
                      ₹{item.revenue.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg border border-indigo-100 shrink-0">
                      <ShoppingCart className="w-3 h-3" />
                      {item.orders}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};