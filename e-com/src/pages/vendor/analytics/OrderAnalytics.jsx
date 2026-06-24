import { useEffect, useState } from "react";
import { vendorService } from "../../../services/vendor.service";
import { ShoppingBag, CreditCard, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import OrderStatusChart from "../dashboard/OrderStatusChart";

export const OrderAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getOrderAnalytics();
      setData(result);
    } catch (error) {
      console.error("Failed to load order analytics", error);
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

  const totalOrders = data.stats.totalOrders;
  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Detailed breakdown of your orders.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-blue-100 rounded-full blur-3xl opacity-70"></div>

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>

              <h3 className="text-4xl font-bold text-slate-900 mt-3">
                {data.stats.totalOrders}
              </h3>

              <span className="inline-flex items-center mt-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                Orders Received
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-green-100 rounded-full blur-3xl opacity-70"></div>

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Revenue
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-3">
                ₹{data.stats.totalRevenue.toLocaleString()}
              </h3>

              <span className="inline-flex items-center mt-4 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                Revenue Generated
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-purple-100 rounded-full blur-3xl opacity-70"></div>

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Avg Order Value
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-3">
                ₹{Math.round(data.stats.avgOrderValue).toLocaleString()}
              </h3>

              <span className="inline-flex items-center mt-4 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                Per Order Average
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <OrderStatusChart />

        {/* Payment Method Breakdown */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          <h2 className="text-lg font-bold text-slate-900 mb-6">
            💳 Payment Methods
          </h2>

          <div className="space-y-4">
            {data.paymentBreakdown.map((item, idx) => {
              const percentage =
                totalOrders > 0
                  ? ((item.count / totalOrders) * 100).toFixed(1)
                  : 0;

              return (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-slate-700 uppercase">
                        {item._id}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>{item.count} Orders</span>
                    <span>₹{item.revenue.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

         
        </div>
      </div>

      {/* Recent Trend (Last 7 Days) */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          📈 Last 7 Days Trend
        </h2>

        <span className="text-sm text-slate-500">
          Orders Overview
        </span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.recentTrend}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="_id"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Bar
              dataKey="orders"
              radius={[10, 10, 0, 0]}
              fill="#3B82F6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
};
