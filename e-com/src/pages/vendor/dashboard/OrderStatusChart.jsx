import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { vendorService } from "../../../services/vendor.service";

const STATUS_COLORS = {
  delivered: "#22c55e",
  shipped: "#3b82f6",
  completed: "#8b5cf6",
  confirmed: "#f59e0b",
  cancelled: "#ef4444",
  pending: "#6b7280",
};

const OrderStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getOrderAnalytics();

      setData(result.statusBreakdown || []);

      // console.log("Order Analytics Data:", result.statusBreakdown);
    } catch (error) {
      console.error("Failed to load order analytics", error);
    } finally {
      setLoading(false);
    }
  };


  const chartData = data.map((item, index) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1).toLowerCase(),
    value: item.count,
    color: STATUS_COLORS[item._id] ?? "#94a3b8",
  }));

  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-full">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-50" />

      <h2 className="text-lg font-bold text-slate-900 mb-6">📊 Order Status</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Chart */}
        <div className="relative w-full md:w-[55%] max-w-sm h-74">
          {totalOrders > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-4xl font-bold text-slate-900">
                  {totalOrders}
                </h3>

                <p className="text-sm text-slate-500">Orders</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end h-full">
              <p className="text-slate-500">No order data available</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="w-full md:w-[45%] max-w-xs space-y-2">
          {chartData.map((item) => {
            const percentage =
              totalOrders > 0
                ? ((item.value / totalOrders) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50"
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
                  <p className="text-lg font-bold text-slate-900">
                    {item.value}
                    <span className="ml-2 text-sm font-medium text-slate-500">
                      ({percentage}%)
                    </span>
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
