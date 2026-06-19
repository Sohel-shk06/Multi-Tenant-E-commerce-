export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue:   { bg: '#EEF2FF', icon: '#6366F1', border: '#C7D2FE', shadow: 'rgba(99,102,241,0.15)' },
    green:  { bg: '#EEF2FF', icon: '#4338CA', border: '#C7D2FE', shadow: 'rgba(67,56,202,0.15)'  },
    purple: { bg: '#E0E7FF', icon: '#4338CA', border: '#C7D2FE', shadow: 'rgba(67,56,202,0.15)'  },
    orange: { bg: '#EEF2FF', icon: '#6366F1', border: '#C7D2FE', shadow: 'rgba(99,102,241,0.15)' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        border: `1px solid ${c.border}`,
        boxShadow: `0 2px 12px ${c.shadow}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818CF8' }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2 tracking-tight" style={{ color: '#1E1B4B' }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: trend === 'up' ? '#DCFCE7' : '#FEE2E2',
                  color: trend === 'up' ? '#16A34A' : '#DC2626',
                }}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-400">from last month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-4"
          style={{
            backgroundColor: c.bg,
            boxShadow: `0 4px 10px ${c.shadow}`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: c.icon }} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="mt-5 h-0.5 rounded-full"
        style={{ background: `linear-gradient(to right, ${c.icon}, transparent)` }}
      />
    </div>
  );
};