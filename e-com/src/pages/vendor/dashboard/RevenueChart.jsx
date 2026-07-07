import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ chartData }) => {
  // console.log("chartdata:-", chartData);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Revenue Overview
        </h2>

        <span className="text-xs text-gray-500">Monthly</span>
      </div>

      <div className="h-56 sm:h-72 lg:h-80">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  new Date(`${value}-01`).toLocaleString("en-US", {
                    month: "short",
                  })
                }
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={55}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  `₹${
                    value >= 1000
                      ? `${Number(value / 1000)
                          .toFixed(1)
                          .toLocaleString()}K`
                      : `${Number(value).toLocaleString()}`
                  }`
                }
                domain={[0, "dataMax"]}
                allowDecimals={false}
                // tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No revenue data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
