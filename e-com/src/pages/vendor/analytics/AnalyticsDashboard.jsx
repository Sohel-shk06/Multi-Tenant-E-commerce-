import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { vendorService } from '../../../services/vendor.service';
import {
  TrendingUp, ShoppingBag, Users, CreditCard,
  Package, Star, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Calendar, BarChart2
} from 'lucide-react';

// ─── Dummy fallback data (matches your existing analytics components style) ───
const revenueData = [
  { period: 'May 12', revenue: 18000 }, { period: 'May 19', revenue: 27000 },
  { period: 'May 26', revenue: 22000 }, { period: 'Jun 02', revenue: 35000 },
  { period: 'Jun 09', revenue: 42760 }, { period: 'Jun 12', revenue: 38000 },
];
const orderData = [
  { period: 'May 12', orders: 120 }, { period: 'May 19', orders: 180 },
  { period: 'May 26', orders: 150 }, { period: 'Jun 02', orders: 210 },
  { period: 'Jun 09', orders: 182 }, { period: 'Jun 12', orders: 195 },
];
const salesByCategoryData = [
  { name: 'Electronics', value: 40.1, amount: 98560 },
  { name: 'Fashion',     value: 23.8, amount: 58420 },
  { name: 'Beauty',      value: 13.3, amount: 32750 },
  { name: 'Fitness',     value: 11.6, amount: 28540 },
  { name: 'Home & Living', value: 11.2, amount: 27489 },
];
const customerGrowthData = [
  { period: 'May 12', customers: 400 }, { period: 'May 19', customers: 900 },
  { period: 'May 26', customers: 1200 }, { period: 'Jun 02', customers: 1600 },
  { period: 'Jun 09', customers: 2000 }, { period: 'Jun 12', customers: 2345 },
];
const revenueBreakdown = [
  { name: 'Product Revenue', value: 75.1, amount: 184450, color: '#a855f7' },
  { name: 'Shipping Revenue', value: 11.6, amount: 28560, color: '#6366f1' },
  { name: 'Tax Collected',    value: 7.5,  amount: 18750, color: '#f59e0b' },
  { name: 'Discount Impact',  value: -6.1, amount: -15000, color: '#ef4444' },
];
const PIE_COLORS = ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, icon: Icon, iconBg, sparkData, sparkColor }) => {
  const positive = parseFloat(change) >= 0;
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      className="rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: iconBg }}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{title}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs flex items-center gap-1 font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change} vs last 30 days
        </span>
      </div>
      {sparkData && (
        <div className="h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${sparkColor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke={sparkColor} strokeWidth={2}
                fill={`url(#spark-${sparkColor})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl p-6 ${className}`}
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-white mb-4">{children}</h2>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs text-white shadow-xl"
      style={{ background: '#1e1030', border: '1px solid rgba(255,255,255,0.15)' }}>
      <p className="mb-1 opacity-60">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue')
            ? `₹${p.value.toLocaleString()}` : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AnalyticsDashboard = () => {
  const [salesData, setSalesData]       = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [orderData2, setOrderData2]     = useState(null);
  const [productData, setProductData]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('Weekly');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [sales, customers, orders, products] = await Promise.allSettled([
        vendorService.getSalesAnalytics(),
        vendorService.getCustomerAnalytics(),
        vendorService.getOrderAnalytics(),
        vendorService.getProductAnalytics(),
      ]);
      if (sales.status === 'fulfilled')     setSalesData(sales.value);
      if (customers.status === 'fulfilled') setCustomerData(customers.value);
      if (orders.status === 'fulfilled')    setOrderData2(orders.value);
      if (products.status === 'fulfilled')  setProductData(products.value);
    } catch (e) {
      console.error('Analytics load error', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(135deg, #0f0720 0%, #1a0a3b 50%, #0d1a40 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  // ── Derived values (real data if available, fallback to dummy) ──
  const totalRevenue  = salesData?.thisMonth?.revenue ?? 245760;
  const totalOrders   = orderData2?.stats?.totalOrders ?? 3854;
  const totalCustomers = customerData?.totalCustomers ?? 2345;
  const avgOrderValue = orderData2?.stats?.avgOrderValue ?? 63.75;
  const revenueGrowth = salesData?.growth?.revenue ?? 18.3;
  const ordersGrowth  = salesData?.growth?.orders ?? 13.5;
  const customersGrowth = 13.2;
  const aovGrowth     = 8.3;

  const totalProducts   = productData?.stats?.totalProducts ?? 1234;
  const activeProducts  = productData?.stats?.activeProducts ?? 987;
  const lowStockCount   = productData?.lowStockProducts?.length ?? 136;
  const outOfStockCount = productData?.stats?.outOfStock ?? 111;

  const repeatCustomers = customerData?.repeatCustomers ?? 1102;
  const newCustomers    = customerData?.acquisitionTrend?.reduce((s, t) => s + t.newCustomers, 0) ?? 1243;
  const retentionRate   = customerData?.repeatRate ?? 68.4;

  const avgRating = 4.8;
  const totalReviews = 2450;
  const ratingDist = [
    { stars: 5, count: 1856, pct: 75.8 },
    { stars: 4, count: 438,  pct: 17.9 },
    { stars: 3, count: 98,   pct: 4.0  },
    { stars: 2, count: 36,   pct: 1.5  },
    { stars: 1, count: 22,   pct: 0.9  },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6"
      style={{ background: 'linear-gradient(135deg, #0f0720 0%, #1a0a3b 50%, #0d1a40 100%)' }}>

      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #4f46e5 100%)',
          boxShadow: '0 0 80px rgba(109,40,217,0.4)'
        }}>
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
          <p className="text-purple-200 mt-1 text-sm">
            Monitor sales trends, customer behavior, and business growth in real time.
          </p>
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-white text-sm backdrop-blur-sm">
          <Calendar className="w-4 h-4 opacity-70" />
          <span>May 12 – Jun 12, 2025</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"    value={`₹${totalRevenue.toLocaleString()}`}
          change={`${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`}
          icon={TrendingUp}   iconBg="linear-gradient(135deg,#6d28d9,#4f46e5)"
          sparkData={revenueData} sparkColor="#a78bfa" />
        <StatCard title="Total Orders"     value={totalOrders.toLocaleString()}
          change={`${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth}%`}
          icon={ShoppingBag}  iconBg="linear-gradient(135deg,#db2777,#9333ea)"
          sparkData={orderData.map(d => ({ revenue: d.orders }))} sparkColor="#f472b6" />
        <StatCard title="Total Customers"  value={totalCustomers.toLocaleString()}
          change={`+${customersGrowth}%`}
          icon={Users}        iconBg="linear-gradient(135deg,#0ea5e9,#6366f1)"
          sparkData={customerGrowthData.map(d => ({ revenue: d.customers }))} sparkColor="#38bdf8" />
        <StatCard title="Avg Order Value"  value={`₹${avgOrderValue.toFixed(2)}`}
          change={`+${aovGrowth}%`}
          icon={CreditCard}   iconBg="linear-gradient(135deg,#f59e0b,#ef4444)"
          sparkData={revenueData.map(d => ({ revenue: d.revenue / 60 }))} sparkColor="#fbbf24" />
      </div>

      {/* ── Revenue Trend + Order Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Revenue Trend</SectionTitle>
            <div className="flex gap-2">
              {['Weekly', 'Monthly'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${activeTab === t
                    ? 'bg-purple-600 text-white'
                    : 'text-white/40 hover:text-white/70'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<DarkTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue"
                stroke="#a855f7" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Analytics */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Order Analytics</SectionTitle>
            <span className="text-xs px-3 py-1 rounded-lg bg-purple-600 text-white">Daily</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Sales by Category + Customer Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales by Category */}
        <Card>
          <SectionTitle>Sales by Category</SectionTitle>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={salesByCategoryData} dataKey="value" cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {salesByCategoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`}
                    contentStyle={{ background: '#1e1030', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-white/40 -mt-2">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-center text-xs text-white/40">Total Revenue</p>
            </div>
            <div className="flex-1 space-y-2">
              {salesByCategoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-white/70">{cat.name}</span>
                  </div>
                  <div className="flex gap-4 text-right">
                    <span className="text-white font-medium">₹{cat.amount.toLocaleString()}</span>
                    <span className="text-white/40 w-10">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Customer Analytics */}
        <Card>
          <SectionTitle>Customer Analytics</SectionTitle>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total Customers',     value: totalCustomers.toLocaleString(), change: '+15.7%', pos: true },
              { label: 'New Customers',        value: newCustomers.toLocaleString(),   change: '+18.3%', pos: true },
              { label: 'Returning Customers',  value: repeatCustomers.toLocaleString(),change: '+12.1%', pos: true },
              { label: 'Retention Rate',       value: `${retentionRate}%`,             change: '+9.7%',  pos: true },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-white/40 mb-1">{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className={`text-xs ${s.pos ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mb-2">Customer Growth</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={customerGrowthData}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<DarkTooltip />} />
              <Area type="monotone" dataKey="customers" name="Customers"
                stroke="#6366f1" strokeWidth={2} fill="url(#custGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Product Analytics + Revenue Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Product Analytics */}
        <Card>
          <SectionTitle>Product Analytics</SectionTitle>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Products',    value: totalProducts },
              { label: 'Active Products',   value: activeProducts },
              { label: 'Low Stock',         value: lowStockCount },
              { label: 'Out of Stock',      value: outOfStockCount },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-white/40 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-white">{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-6">
            {/* Circular health score */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="10"
                  strokeDasharray={`${0.94 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">94%</span>
                <span className="text-xs text-white/40">Health</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/40 mb-2">Products Added Over Time</p>
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={revenueData.map((d, i) => ({ period: d.period, count: 60 + i * 12 }))}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Area type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} fill="url(#prodGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Product Health Score: Excellent
          </p>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <SectionTitle>Revenue Breakdown</SectionTitle>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={revenueBreakdown.filter(d => d.value > 0)}
                    dataKey="value" cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {revenueBreakdown.filter(d => d.value > 0).map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-white/40">Total</p>
                <p className="text-sm font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {revenueBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: item.color + '33' }}>
                      <TrendingUp className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">{item.name}</p>
                      <p className="text-sm font-bold text-white">
                        {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${item.value < 0 ? 'text-red-400' : 'text-white/60'}`}>
                    {item.value > 0 ? '+' : ''}{item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Customer Reviews ── */}
      <Card>
        <SectionTitle>Customer Reviews</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-white/40 mb-2">Average Rating</p>
            <p className="text-6xl font-bold text-white">{avgRating}</p>
            <p className="text-white/40 text-sm">/ 5</p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2">Total Reviews: <span className="text-white font-medium">{totalReviews.toLocaleString()}</span></p>
          </div>

          {/* Rating Distribution */}
          <div>
            <p className="text-xs text-white/40 mb-3">Rating Distribution</p>
            <div className="space-y-2">
              {ratingDist.map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-12 text-right">{r.stars} Stars</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${r.pct}%`, background: r.stars >= 4 ? '#a855f7' : r.stars === 3 ? '#6366f1' : '#ef4444' }} />
                  </div>
                  <span className="text-white/40 text-xs w-20">{r.count.toLocaleString()} ({r.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Sentiment */}
          <div className="space-y-3">
            {[
              { label: 'Positive Reviews', value: 2102, pct: '85.8%', emoji: '😊', color: 'text-emerald-400' },
              { label: 'Neutral Reviews',  value: 236,  pct: '9.6%',  emoji: '😐', color: 'text-yellow-400' },
              { label: 'Negative Reviews', value: 112,  pct: '4.6%',  emoji: '😞', color: 'text-red-400'   },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs text-white/50">{s.label}</p>
                  <p className={`text-base font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
                </div>
                <span className="text-xs text-white/40">{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Quick Nav Links ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Revenue',  path: '/vendor/analytics/revenue',   color: '#6d28d9' },
          { label: 'Sales',    path: '/vendor/analytics/sales',     color: '#db2777' },
          { label: 'Products', path: '/vendor/analytics/products',  color: '#0ea5e9' },
          { label: 'Orders',   path: '/vendor/analytics/orders',    color: '#f59e0b' },
          { label: 'Customers',path: '/vendor/analytics/customers', color: '#10b981' },
        ].map((item, i) => (
          <Link key={i} to={item.path}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: item.color + '33', border: `1px solid ${item.color}55` }}>
            <span>{item.label} Analytics</span>
            <ArrowUpRight className="w-4 h-4 opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  );
};
