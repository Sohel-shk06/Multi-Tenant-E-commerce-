import { useEffect, useState } from "react";
import { vendorService } from "../../../services/vendor.service";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getSalesAnalytics();
      setData(result);
    } catch (error) {
      console.error("Failed to load sales analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!data)
    return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const GrowthBadge = ({ value }) => (
    <span
      className={`inline-flex items-center text-xs font-medium ${value >= 0 ? "text-green-600" : "text-red-600"}`}
    >
      {value >= 0 ? (
        <TrendingUp className="w-3 h-3 mr-1" />
      ) : (
        <TrendingDown className="w-3 h-3 mr-1" />
      )}
      {value >= 0 ? "+" : ""}
      {value}% vs last month
    </span>
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Sales Analytics 📈
        </h1>
        <p className="text-slate-500 mt-1">
          Track revenue, orders and store performance.
        </p>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Today's Revenue</p>

            <h2 className="text-5xl font-bold mt-2">
              ₹{data.today.revenue.toLocaleString()}
            </h2>

            <p className="text-blue-100 mt-3">
              {data.today.orders} Orders Today
            </p>
          </div>

          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Calendar className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm text-slate-500">This Month Revenue</p>
          <h3 className="text-3xl font-bold mt-2">
            ₹{data.thisMonth.revenue.toLocaleString()}
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {data.thisMonth.orders} Orders
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm text-slate-500">Last Month</p>
          <h3 className="text-3xl font-bold mt-2">
            ₹{data.lastMonth.revenue.toLocaleString()}
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {data.lastMonth.orders} Orders
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm text-slate-500">Revenue Growth</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            +{data.growth.revenue}%
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm text-slate-500">Avg Order Value</p>
          <h3 className="text-3xl font-bold mt-2">
            ₹
            {data.thisMonth.orders > 0
              ? Math.round(
                  data.thisMonth.revenue / data.thisMonth.orders,
                ).toLocaleString()
              : 0}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Revenue Trend</h3>

          <div className="h-80 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Chart Coming Soon</span>
          </div>
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Sales By Category</h3>

          <div className="h-80 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Pie Chart Placeholder</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Product */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">🏆 Top Selling Product</h3>

          <div className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Waiting For Backend Data</span>
          </div>
        </div>

        {/* payment methods */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">💳 Payment Methods</h3>

          <div className="h-56 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Payment Distribution</span>
          </div>
        </div>
      </div>

    </div>
  );
};
