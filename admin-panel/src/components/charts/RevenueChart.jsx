import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name}: ₹{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center">
        <p className="text-sm text-gray-400">No revenue data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="w-4 h-0.5 bg-[#4338CA] rounded inline-block" />
          Gross revenue
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="w-4 border-t-2 border-dashed border-[#818CF8] inline-block" />
          Commission
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#d1d5db"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#d1d5db"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={38}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4338CA"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#4338CA', stroke: '#fff', strokeWidth: 2 }}
            name="Gross revenue"
          />
          <Line
            type="monotone"
            dataKey="commission"
            stroke="#818CF8"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 3, fill: '#818CF8', stroke: '#fff', strokeWidth: 2 }}
            name="Commission"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};