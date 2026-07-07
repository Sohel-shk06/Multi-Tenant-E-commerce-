import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { Package, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const ProductAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getProductAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load product analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center text-gray-400 text-sm">
      Failed to load data.
    </div>
  );

  const maxRevenue = Math.max(...data.topProducts.map(p => p.totalRevenue), 1);
  const medals = ['🥇', '🥈', '🥉'];

  const stats = [
    { label: 'Total Products', value: data.summary.totalProducts,    icon: <Package className="w-4 h-4 text-blue-400" />,     iconBg: 'bg-blue-500/20',   valueColor: 'text-white' },
    { label: 'Active',         value: data.summary.activeProducts,   icon: <CheckCircle className="w-4 h-4 text-green-400" />, iconBg: 'bg-green-500/20',  valueColor: 'text-green-400' },
    { label: 'Drafts',         value: data.summary.draftProducts,    icon: <Clock className="w-4 h-4 text-yellow-400" />,      iconBg: 'bg-yellow-500/20', valueColor: 'text-yellow-400' },
    { label: 'Inactive',       value: data.summary.inactiveProducts, icon: <XCircle className="w-4 h-4 text-gray-400" />,      iconBg: 'bg-gray-500/20',   valueColor: 'text-gray-300' },
    { label: 'Low Stock',      value: data.summary.lowStockProducts, icon: <AlertTriangle className="w-4 h-4 text-orange-400" />, iconBg: 'bg-orange-500/20', valueColor: 'text-orange-400' },
    { label: 'Out of Stock',   value: data.summary.outOfStock,       icon: <XCircle className="w-4 h-4 text-red-400" />,       iconBg: 'bg-red-500/20',    valueColor: 'text-red-400' },
  ];

  return (
    <div className="min-h-screen bg-[#EFF6FF]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: perspective(600px) rotateX(-6deg) translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(37,99,235,0.22), 0 4px 12px -2px rgba(37,99,235,0.12);
        }
        .product-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 14px;
        }
        .product-row:hover {
          transform: translateX(5px);
          box-shadow: -3px 0 0 #3B82F6;
        }
        .bar-track {
          border-radius: 999px;
          background: #DBEAFE;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.09), inset 0 -1px 2px rgba(255,255,255,0.7);
          overflow: visible;
        }
        .bar-fill {
          border-radius: 999px;
          background: linear-gradient(90deg, #1D4ED8, #3B82F6);
          box-shadow: 0 3px 8px rgba(59,130,246,0.45), 0 1px 0 #1E40AF;
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
        .img-3d {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-row:hover .img-3d {
          transform: perspective(300px) rotateY(-8deg) scale(1.05);
          box-shadow: 4px 4px 12px rgba(37,99,235,0.2);
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Analytics</h1>
          <p className="text-blue-300/70 text-sm mt-1">Platform-wide product performance overview</p>

          {/* 3D Stat Cards */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-3d bg-white/5 border border-white/10 rounded-2xl px-4 py-4 cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
                <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
                <p className="text-xs text-blue-300/60 font-medium mt-1 leading-tight">{s.label}</p>
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
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"
              style={{ boxShadow: '0 4px 10px rgba(37,99,235,0.13)' }}>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Top Selling Products</h2>
              <p className="text-xs text-gray-400 mt-0.5">Platform-wide · {data.topProducts.length} products ranked</p>
            </div>
          </div>

          <div className="p-6">
            {data.topProducts.length > 0 ? (
              <div className="space-y-3">
                {data.topProducts.map((item, idx) => {
                  const pct = (item.totalRevenue / maxRevenue) * 100;
                  return (
                    <div key={idx} className="product-row p-3 bg-gray-50/60 border border-gray-100">
                      <div className="flex items-center gap-4">

                        {/* Rank */}
                        <div className="w-8 text-center shrink-0">
                          {idx < 3
                            ? <span className="text-xl">{medals[idx]}</span>
                            : <span className="text-sm font-bold text-gray-300">#{idx + 1}</span>
                          }
                        </div>

                        {/* Product image */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 img-3d border border-blue-100"
                          style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.12)' }}>
                          {item._id?.images?.[0]?.url ? (
                            <img src={item._id.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-300" />
                            </div>
                          )}
                        </div>

                        {/* Name + sold */}
                        <div className="w-40 shrink-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {item._id?.title || 'Unknown Product'}
                          </p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md border border-blue-100 mt-1">
                            {item.totalSold} sold
                          </span>
                        </div>

                        {/* 3D Bar */}
                        <div className="flex-1">
                          <div className="bar-track h-5 w-full">
                            <div
                              className="bar-fill h-full"
                              style={{ width: `${Math.max(pct, 3)}%` }}
                            />
                          </div>
                        </div>

                        {/* Revenue */}
                        <div className="w-28 text-right shrink-0">
                          <p className="text-sm font-bold text-blue-700">₹{item.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{pct.toFixed(0)}% of top</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3"
                  style={{ boxShadow: '0 4px 12px rgba(37,99,235,0.10)' }}>
                  <Package className="w-6 h-6 text-blue-200" />
                </div>
                <p className="text-sm font-medium text-gray-400">No sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};