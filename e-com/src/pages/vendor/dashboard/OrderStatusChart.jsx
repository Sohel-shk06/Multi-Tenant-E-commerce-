import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { vendorService } from "../../../services/vendor.service";

const COLORS = {
  delivered: "#22C55E",
  pending: "#FACC15",
  confirmed: "#3B82F6",
  completed: "#EF4444",
};

const OrderStatusChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getOrderAnalytics();
      setData(result.statusBreakdown);
      console.log("Order Analytics Data:", result.statusBreakdown);
    } catch (error) {
      console.error("Failed to load order analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border">
        Loading...
      </div>
    );
  }

  const chartData = [
    {
      name: "Delivered",
      value: data[0].count || 0,
      color: COLORS.delivered,
    },
    {
      name: "Pending",
      value: data[3].count || 0,
      color: COLORS.pending,
    },
    {
      name: "confirmed",
      value: data[2].count || 0,
      color: COLORS.confirmed,
    },
    {
      name: "Completed",
      value: data[1].count || 0,
      color: COLORS.completed,
    },
  ];

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-full">

      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-50"></div>

      <h2 className="text-lg font-bold text-slate-900 mb-6">
        📊 Order Status
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* Donut Chart */}
        <div className="relative w-full max-w-sm h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-4xl font-bold text-slate-900">
              {totalOrders}
            </h3>

            <p className="text-sm text-slate-500">
              Orders
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full max-w-xs space-y-3">
          {chartData.map((item) => {
            const percentage =
              totalOrders > 0
                ? ((item.value / totalOrders) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <span className="font-medium text-slate-700">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {item.value}
                  </p>

                  <p className="text-xs text-slate-500">
                    {percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default OrderStatusChart;