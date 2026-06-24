import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentAnalytics } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { DollarSign, TrendingUp, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export const PaymentAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentAnalytics());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          <p className="font-semibold">Failed to load analytics</p>
          <p className="text-[12px] mt-1">{error}</p>
          <button
            onClick={() => dispatch(fetchPaymentAnalytics())}
            className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-md text-[12px] hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !analytics) return <PageLoader />;

  const COLORS = ['#4338CA', '#6366F1', '#818CF8', '#312E81', '#1E1B4B'];

  const statusData = analytics.statusBreakdown?.map(item => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1),
    value: item.count,
    amount: item.amount,
    id: item._id,
  })) || [];

  const methodData = analytics.methodBreakdown?.map(item => ({
    name: item._id?.toUpperCase(),
    value: item.count,
  })) || [];

  const trendData = analytics.monthlyTrend?.map(item => ({
    name: item._id,
    amount: item.amount,
    count: item.count,
  })) || [];

  const totalAmount = analytics.totalStats?.totalAmount || 0;
  const totalCount = analytics.totalStats?.count || 0;
  const avgTx = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;
  const paidCount = analytics.statusBreakdown?.find(s => s._id === 'paid')?.count || 0;
  const successRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  const summaryCards = [
    { label: 'Total Amount', value: `₹${totalAmount.toLocaleString()}`, icon: DollarSign, color: '#15803D' },
    { label: 'Total Transactions', value: totalCount, icon: TrendingUp, color: '#4338CA' },
    { label: 'Avg Transaction', value: `₹${avgTx.toLocaleString()}`, icon: CreditCard, color: '#6D28D9' },
    { label: 'Success Rate', value: `${successRate}%`, icon: CheckCircle, color: '#15803D' },
  ];

  const statusIcons = {
    paid:     <CheckCircle className="w-4 h-4" style={{ color: '#15803D' }} />,
    pending:  <Clock className="w-4 h-4" style={{ color: '#A16207' }} />,
    failed:   <XCircle className="w-4 h-4" style={{ color: '#DC2626' }} />,
    refunded: <CreditCard className="w-4 h-4" style={{ color: '#4338CA' }} />,
  };

  const statusStyles = {
    paid:     { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
    pending:  { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
    failed:   { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    refunded: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
          <p className="text-gray-400 mb-1">{label}</p>
          <p className="font-semibold" style={{ color: '#4338CA' }}>
            ₹{payload[0].value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">Payment Analytics</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Overview of payment performance and trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">{card.label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-[22px] font-bold text-gray-900 leading-none">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-900">Monthly Payment Trend</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Revenue over time</p>
          </div>
          <div className="p-5">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    width={38}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#4338CA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-[13px] text-gray-400">No data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-900">Payment Methods</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Distribution by method</p>
          </div>
          <div className="p-5">
            {methodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', color: '#6b7280' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-[13px] text-gray-400">No data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[13px] font-semibold text-gray-900">Payment Status Breakdown</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Count and amount by status</p>
        </div>
        <div className="p-5">
          {statusData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusData.map((item, idx) => {
                const s = statusStyles[item.id] || { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
                return (
                  <div
                    key={idx}
                    className="rounded-xl border p-4"
                    style={{ backgroundColor: s.bg, borderColor: s.border }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {statusIcons[item.id] || <CreditCard className="w-4 h-4 text-gray-500" />}
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: s.color }}
                      >
                        {item.id}
                      </span>
                    </div>
                    <p className="text-[22px] font-bold" style={{ color: s.color }}>{item.value}</p>
                    <p className="text-[11px] mt-1" style={{ color: s.color }}>
                      ₹{item.amount?.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-[13px] text-gray-400">No payment data available yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};