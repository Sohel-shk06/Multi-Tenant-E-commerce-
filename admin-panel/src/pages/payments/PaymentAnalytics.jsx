import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentAnalytics } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { DollarSign, TrendingUp, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const PaymentAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentAnalytics());
  }, [dispatch]);

  // ✅ FIX: Error ko pehle check karein
  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          <p className="font-semibold">Failed to load analytics</p>
          <p className="text-xs mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchPaymentAnalytics())}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Loading state
  if (isLoading || !analytics) return <PageLoader />;

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  const statusData = analytics.statusBreakdown?.map(item => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1),
    value: item.count
  })) || [];

  const methodData = analytics.methodBreakdown?.map(item => ({
    name: item._id?.toUpperCase(),
    value: item.count
  })) || [];

  const trendData = analytics.monthlyTrend?.map(item => ({
    name: item._id,
    amount: item.amount,
    count: item.count
  })) || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of payment performance and trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Amount</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{analytics.totalStats?.totalAmount?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Transactions</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.totalStats?.count || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Avg Transaction</span>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{analytics.totalStats?.count > 0 
              ? Math.round(analytics.totalStats.totalAmount / analytics.totalStats.count).toLocaleString()
              : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Success Rate</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.totalStats?.count > 0
              ? Math.round(
                  ((analytics.statusBreakdown?.find(s => s._id === 'paid')?.count || 0) / analytics.totalStats.count) * 100
                )
              : 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Payment Trend</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg">No data available</p>
                <p className="text-xs mt-1">Payments hone ke baad yahan data dikhega</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
          {methodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Status Breakdown</h2>
          {analytics.statusBreakdown?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.statusBreakdown?.map((item, idx) => {
                const icons = {
                  paid: <CheckCircle className="w-6 h-6 text-green-600" />,
                  pending: <Clock className="w-6 h-6 text-yellow-600" />,
                  failed: <XCircle className="w-6 h-6 text-red-600" />,
                  refunded: <CreditCard className="w-6 h-6 text-blue-600" />
                };
                return (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      {icons[item._id] || <CreditCard className="w-6 h-6 text-gray-600" />}
                      <span className="text-xs text-gray-500 uppercase">{item._id}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                    <p className="text-xs text-gray-500">₹{item.amount?.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-gray-500">
              No payment data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};