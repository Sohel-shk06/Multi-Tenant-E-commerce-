import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { vendorService } from "../../../services/vendor.service";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Star,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart2,
} from "lucide-react";

// const customerGrowthData = [
//   { period: "May 12", customers: 400 },
//   { period: "May 19", customers: 900 },
//   { period: "May 26", customers: 1200 },
//   { period: "Jun 02", customers: 1600 },
//   { period: "Jun 09", customers: 2000 },
//   { period: "Jun 12", customers: 2345 },
// ];
const PIE_COLORS = ["#a855f7", "#6366f1", "#ec4899", "#f59e0b", "#10b981"];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  sparkData,
  sparkColor,
}) => {
  const positive = parseFloat(change) >= 0;
  // console.log('sp:-',sparkData)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl">
            <Icon className="w-5 h-5 text-black" />
          </div>
          <span className="text-sm">{title}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-black">{value}</p>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs flex items-center gap-1 font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change} vs last days
        </span>
      </div>
      {sparkData && (
        <div className="h-12 -mx-1 hidden lg:block">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sparkData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`spark-${sparkColor}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={sparkColor}
                strokeWidth={2}
                fill={`url(#spark-${sparkColor})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-6 ${className} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-black mb-4">{children}</h2>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl px-3 py-2 text-xs text-slate-700 shadow-lg"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <p className="mb-1 text-slate-500">{label}</p>

      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong className="text-slate-900">
            {typeof p.value === "number" &&
            p.name?.toLowerCase().includes("revenue")
              ? `₹${p.value.toLocaleString()}`
              : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AnalyticsDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [orderData2, setOrderData2] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Weekly");
  const [revenueCard, setRevenueCard] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [sales, customers, orders, products, review, revenue] =
        await Promise.allSettled([
          vendorService.getSalesAnalytics(),
          vendorService.getCustomerAnalytics(),
          vendorService.getOrderAnalytics(),
          vendorService.getProductAnalytics(),
          vendorService.getReviewAnalytics(),
          vendorService.getRevenueAnalytics({
            period: "daily",
          }),
        ]);
      if (sales.status === "fulfilled") setSalesData(sales.value);
      if (customers.status === "fulfilled") setCustomerData(customers.value);
      if (orders.status === "fulfilled") setOrderData2(orders.value);
      if (products.status === "fulfilled") setProductData(products.value);
      if (review.status === "fulfilled") setReview(review.value);
      if (revenue.status === "fulfilled") setRevenueCard(revenue.value.data);
    } catch (e) {
      console.error("Analytics load error", e);
    } finally {
      setLoading(false);
    }
  };
  const [revenueData, setRevenueData] = useState(null);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    loadRevenueData();
  }, [period]);

  const loadRevenueData = async () => {
    setLoading(true);
    try {
      const result = await vendorService.getRevenueAnalytics({ period });
      setRevenueData(result.data);
      // console.log(result);
    } catch (error) {
      console.error("Failed to load revenue analytics", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("oody--", review);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // ── Derived values (real data if available, fallback to dummy) ──
  const totalRevenue = salesData?.thisMonth?.revenue ?? 0;
  const totalOrders = orderData2?.stats?.totalOrders ?? 0;
  const totalCustomers = customerData?.totalCustomers ?? 0;
  const avgOrderValue = orderData2?.stats?.avgOrderValue ?? 0;
  const revenueGrowth = salesData?.growth?.revenue ?? 0;
  const ordersGrowth = salesData?.growth?.orders ?? 0;
  const customersGrowth = 0;
  const aovGrowth = 0;

  const totalProducts = productData?.stats?.totalProducts ?? 0;
  const activeProducts = productData?.stats?.activeProducts ?? 0;
  const lowStockCount = productData?.lowStockProducts?.length ?? 0;
  const outOfStockCount = productData?.stats?.outOfStock ?? 0;
  const healthScore = Math.max(
    0,
    Math.round(
      ((activeProducts - lowStockCount * 0.5 - outOfStockCount) /
        totalProducts) *
        100,
    ),
  );
  const healthInfo =
    healthScore >= 80
      ? {
          status: "Excellent",
          dot: "bg-emerald-500",
          text: "text-emerald-600",
        }
      : healthScore >= 60
        ? {
            status: "Good",
            dot: "bg-blue-500",
            text: "text-blue-600",
          }
        : healthScore >= 40
          ? {
              status: "Average",
              dot: "bg-amber-500",
              text: "text-amber-600",
            }
          : {
              status: "Poor",
              dot: "bg-red-500",
              text: "text-red-600",
            };

  const repeatCustomers = customerData?.repeatCustomers ?? 0;
  const newCustomers =
    customerData?.acquisitionTrend?.reduce((s, t) => s + t.newCustomers, 0) ??
    0;
  const retentionRate = customerData?.repeatRate ?? 0;
  const distribution = review?.ratingDistribution || {};

  const positiveCount = (distribution[5] || 0) + (distribution[4] || 0);

  const neutralCount = distribution[3] || 0;

  const negativeCount = (distribution[2] || 0) + (distribution[1] || 0);

  const totalReviews = review?.totalReviews || 0;

  const positivePct =
    totalReviews > 0 ? ((positiveCount / totalReviews) * 100).toFixed(1) : 0;

  const neutralPct =
    totalReviews > 0 ? ((neutralCount / totalReviews) * 100).toFixed(1) : 0;

  const negativePct =
    totalReviews > 0 ? ((negativeCount / totalReviews) * 100).toFixed(1) : 0;

  console.log(orderData2);

  return (
    <div className="min-h-screen p-3 lg:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden p-8relative bg-linear-to-br from-blue-700 to-blue-500 p-8 text-white shadow-xl">
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
          <p className="text-purple-200 mt-1 text-sm">
            Monitor sales trends, customer behavior, and business growth in real
            time.
          </p>
        </div>
        {/* <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-white text-sm backdrop-blur-sm">
          <Calendar className="w-4 h-4 opacity-70" />
          <span>May 12 – Jun 12, 2025</span>
        </div> */}
      </div>

      {/* ── Stat Cards ── */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="grid grid-cols-4 min-w-[900px] gap-3">
          <StatCard
            title="Total Revenue"
            value={`₹${
              totalRevenue >= 1000
                ? `${(totalRevenue / 1000).toFixed(1)}K`
                : totalRevenue.toLocaleString()
            }`}
            change={`${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}%`}
            icon={TrendingUp}
            iconBg="linear-gradient(135deg,#8b5cf6,#6366f1)"
            sparkData={revenueCard}
            sparkColor="#8b5cf6"
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md"
          />

          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            change={`${ordersGrowth >= 0 ? "+" : ""}${ordersGrowth}%`}
            icon={ShoppingBag}
            iconBg="linear-gradient(135deg,#ec4899,#a855f7)"
            sparkData={
              orderData2?.recentTrend?.map((d) => ({
                revenue: d.orders,
              })) || []
            }
            sparkColor="#ec4899"
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md"
          />

          <StatCard
            title="Total Customers"
            value={totalCustomers.toLocaleString()}
            change={`+${customersGrowth}%`}
            icon={Users}
            iconBg="linear-gradient(135deg,#38bdf8,#6366f1)"
            sparkData={customerData?.acquisitionTrend?.map((d) => ({
              revenue: d.customers,
            }))}
            sparkColor="#38bdf8"
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md"
          />

          <StatCard
            title="Avg Order Value"
            value={`₹${
              avgOrderValue >= 1000
                ? `${(avgOrderValue / 1000).toFixed(1)}K`
                : avgOrderValue.toLocaleString()
            }`}
            change={`+${aovGrowth}%`}
            icon={CreditCard}
            iconBg="linear-gradient(135deg,#fbbf24,#f97316)"
            sparkData={
              orderData2?.recentTrend?.map((d) => ({
                revenue: d.revenue,
              })) || []
            }
            sparkColor="#fbbf24"
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* ── Revenue Trend + Order Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Revenue Trend</SectionTitle>

            <div className="flex gap-2">
              {["daily", "Weekly", "Monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${
                    period === t
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                dataKey="period"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                width={"auto"}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />

              <Tooltip content={<LightTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#a855f7"
                strokeWidth={2.5}
                fill="url(#revGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Analytics */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Order Analytics</SectionTitle>

            <span className="text-xs px-3 py-1 rounded-lg bg-purple-100 text-purple-700 font-medium">
              Daily
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderData2?.recentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                dataKey="_id"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                dataKey="orders"
                width="auto"
                allowDecimals={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<LightTooltip />} />

              <Bar
                dataKey="orders"
                name="Orders"
                fill="#ec4899"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product analysis  + Customer Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Product Analytics */}
        <Card>
          <SectionTitle>Product Analytics</SectionTitle>

          <div className="flex items-center gap-8">
            {/* Health Score */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="16"
                />

                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={40}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 - (healthScore / 100) * (2 * Math.PI * 40)
                  }
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">
                  {healthScore}%
                </span>
                <span className="text-sm text-slate-500">Health</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex-1 flex flex-col gap-3">
              {[
                { label: "Total Products", value: totalProducts },
                { label: "Active Products", value: activeProducts },
                { label: "Low Stock", value: lowStockCount },
                { label: "Out of Stock", value: outOfStockCount },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 flex justify-between items-center gap-x-1"
                >
                  <p className="text-sm font-medium text-slate-600">
                    {s.label}
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {s.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p
            className={`text-xs mt-4 flex items-center gap-1 ${healthInfo.text}`}
          >
            <span
              className={`w-2 h-2 rounded-full inline-block ${healthInfo.dot}`}
            />
            Product Health Score: {healthInfo.status}
          </p>
        </Card>

        {/* Customer Analytics */}
        <Card>
          <SectionTitle>Customer Analytics</SectionTitle>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {
                label: "Total Customers",
                value: totalCustomers.toLocaleString(),
                pos: true,
              },
              {
                label: "New Customers",
                value: newCustomers.toLocaleString(),
                pos: true,
              },
              {
                label: "Returning Customers",
                value: repeatCustomers.toLocaleString(),
                pos: true,
              },
              {
                label: "Retention Rate",
                value: `${retentionRate}%`,
                pos: true,
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>

                <p className="text-lg font-bold text-slate-900">{s.value}</p>

                <p
                  className={`text-xs ${
                    s.pos ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mb-2">Customer Growth</p>

          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={customerData?.acquisitionTrend}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="period"
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis hide />

              <Tooltip content={<LightTooltip />} />

              <Area
                type="monotone"
                dataKey="customers"
                name="Customers"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#custGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Sales Analytics + Revenue Breakdown ── */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> */}
      {/* Sales by Category */}
      {/* <Card>
          <SectionTitle>Sales by Category</SectionTitle>

          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={salesByCategoryData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {salesByCategoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      color: "#334155",
                      fontSize: 12,
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <p className="text-center text-xs text-slate-500 -mt-2">
                ₹{totalRevenue.toLocaleString()}
              </p>

              <p className="text-center text-xs text-slate-500">
                Total Revenue
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {salesByCategoryData.map((cat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />

                    <span className="text-slate-600">{cat.name}</span>
                  </div>

                  <div className="flex gap-4 text-right">
                    <span className="text-slate-900 font-medium">
                      ₹{cat.amount.toLocaleString()}
                    </span>

                    <span className="text-slate-500 w-10">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card> */}

      {/* Revenue Breakdown */}
      {/* <Card>
          <SectionTitle>Revenue Breakdown</SectionTitle>

          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown.filter((d) => d.value > 0)}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {revenueBreakdown
                      .filter((d) => d.value > 0)
                      .map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-500">Total</p>

                <p className="text-sm font-bold text-slate-900">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {revenueBreakdown.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{ background: item.color + "22" }}
                    >
                      <TrendingUp
                        className="w-3.5 h-3.5"
                        style={{ color: item.color }}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-slate-600">{item.name}</p>

                      <p className="text-sm font-bold text-slate-900">
                        {item.amount < 0 ? "-" : ""}₹
                        {Math.abs(item.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      item.value < 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {item.value > 0 ? "+" : ""}
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card> */}
      {/* </div> */}

      {/* ── Customer Reviews ── */}
      <Card>
        <SectionTitle>Customer Reviews</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-8 space-x-6 justify-between">
          {/* Average Rating */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            {/* Desktop */}
            <div className="hidden md:flex md:flex-col md:items-center">
              <p className="text-xs text-slate-500 mb-2">Average Rating</p>

              <p className="text-6xl font-bold text-slate-900">
                {review?.averageRating}
              </p>

              <p className="text-slate-500 text-sm">/5</p>

              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(review?.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Total Reviews{" "}
                <span className="text-slate-900 font-medium">
                  {review?.totalReviews.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Mobile */}
            <div className="flex flex-col items-center md:hidden">
              <p className="text-xs text-slate-500 mb-2">Average Rating</p>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= Math.round(review?.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-lg font-bold text-slate-900">
                  {review?.averageRating}
                  <span className="text-sm text-slate-500">/5</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                {review?.totalReviews.toLocaleString()} Reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="col-span-3 mt-6">
            <p className="text-xs text-slate-500 mb-3">Rating Distribution</p>

            <div className="space-y-2">
              {Object.entries(review?.ratingDistribution || {})
                .reverse()
                .map(([rating, count]) => {
                  const pct =
                    review?.totalReviews > 0
                      ? Math.round((count / review.totalReviews) * 100)
                      : 0;

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-3 text-sm justify-between w-full md:w-[95%]"
                    >
                      <span className="text-slate-600 w-12 text-right">
                        {rating} Stars
                      </span>

                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              Number(rating) >= 4
                                ? "#a855f7"
                                : Number(rating) === 3
                                  ? "#6366f1"
                                  : "#ef4444",
                          }}
                        />
                      </div>

                      <span className="text-slate-500 text-xs">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Review Sentiment */}
          <div className="col-span-3 space-y-3 hidden md:block">
            {[
              {
                label: "Positive Reviews",
                value: positiveCount,
                pct: `${positivePct}%`,
                emoji: "😊",
                color: "text-emerald-600",
              },
              {
                label: "Neutral Reviews",
                value: neutralCount,
                pct: `${neutralPct}%`,
                emoji: "😐",
                color: "text-yellow-600",
              },
              {
                label: "Negative Reviews",
                value: negativeCount,
                pct: `${negativePct}%`,
                emoji: "😞",
                color: "text-red-600",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-4 py-3 bg-slate-50 border border-slate-200"
              >
                <span className="text-2xl">{s.emoji}</span>

                <div className="flex-1">
                  <p className="text-xs text-slate-500">{s.label}</p>

                  <p className={`text-base font-bold ${s.color}`}>
                    {s.value.toLocaleString()}
                  </p>
                </div>

                <span className="text-xs text-slate-500">{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Quick Nav Links ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Revenue",
            path: "/vendor/analytics/revenue",
            color: "#6d28d9",
          },
          { label: "Sales", path: "/vendor/analytics/sales", color: "#db2777" },
          {
            label: "Products",
            path: "/vendor/analytics/products",
            color: "#0ea5e9",
          },
          {
            label: "Orders",
            path: "/vendor/analytics/orders",
            color: "#f59e0b",
          },
          {
            label: "Customers",
            path: "/vendor/analytics/customers",
            color: "#10b981",
          },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-black transition-all hover:scale-105"
            style={{
              background: item.color + "33",
              border: `1px solid ${item.color}55`,
            }}
          >
            <span>{item.label} Analytics</span>
            <ArrowUpRight className="w-4 h-4 opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  );
};
