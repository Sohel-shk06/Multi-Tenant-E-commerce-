export const StatsCard = ({ title, value, trend, trendValue, pct = 60, color = '#4338CA' }) => {
  const r = 22;
  const cx = 26;
  const cy = 26;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  const gap = circ - dash;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-[18px] flex items-center gap-4 hover:shadow-md transition-shadow duration-200">

      {/* Progress Ring */}
      <div className="relative flex-shrink-0 w-[52px] h-[52px]">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke="#f3f4f6" strokeWidth="4"
          />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${dash.toFixed(1)} ${gap.toFixed(1)}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
          style={{ color }}
        >
          {pct}%
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide mb-1 uppercase">
          {title}
        </p>
        <p className="text-[20px] font-bold text-gray-900 leading-none tracking-tight">
          {value}
        </p>
        {trend && (
          <p className="text-[11px] mt-[5px] font-medium text-green-600">
            {trend === 'up' ? '↑' : '↓'} {trendValue} vs last month
          </p>
        )}
        {!trend && (
          <p className="text-[11px] mt-[5px] text-gray-400">Monthly metric</p>
        )}
      </div>
    </div>
  );
};