export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
      style={{
        border: '1px solid #C7D2FE',
        boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold uppercase tracking-widest truncate"
            style={{ color: '#818CF8' }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-extrabold mt-2 tracking-tight"
            style={{ color: '#1E1B4B' }}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: trend === 'up' ? '#DCFCE7' : '#FEE2E2',
                  color: trend === 'up' ? '#15803D' : '#DC2626',
                }}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      <div
        className="mt-5 h-0.5 rounded-full"
        style={{ background: 'linear-gradient(to right, #6366F1, #C7D2FE, transparent)' }}
      />
    </div>
  );
};