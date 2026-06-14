import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  delivered: "#22C55E",
  pending: "#FACC15",
  processing: "#3B82F6",
  cancelled: "#EF4444",
};

const OrderStatusChart = () => {
  const { orders = [] } = useSelector((state) => state.vendorOrders);

  const chartData = useMemo(() => {
    const counts = {
      delivered: 0,
      pending: 0,
      processing: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase();

      if (status === "completed" || status === "delivered") {
        counts.delivered++;
      } else if (status === "pending") {
        counts.pending++;
      } else if (
        status === "confirmed" ||
        status === "shipped" ||
        status === "processing"
      ) {
        counts.processing++;
      } else if (status === "cancelled") {
        counts.cancelled++;
      }
    });

    return [
      {
        name: "Delivered",
        value: counts.delivered,
        color: COLORS.delivered,
      },
      {
        name: "Pending",
        value: counts.pending,
        color: COLORS.pending,
      },
      {
        name: "Processing",
        value: counts.processing,
        color: COLORS.processing,
      },
      {
        name: "Cancelled",
        value: counts.cancelled,
        color: COLORS.cancelled,
      },
    ];
  }, [orders]);

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Order Status
      </h2>
    
      <div className="flex items-center justify-between">
        {/* Chart */}
        <div className="relative w-[220px] h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
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

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-gray-900">
              {totalOrders}
            </h3>
            <p className="text-sm text-gray-500">
              Total Orders
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {chartData.map((item) => {
            const percentage =
              totalOrders > 0
                ? ((item.value / totalOrders) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.name}
                className="flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.value} ({percentage}%)
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