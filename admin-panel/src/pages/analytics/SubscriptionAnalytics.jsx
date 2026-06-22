import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { CreditCard, Users, DollarSign, TrendingUp } from 'lucide-react';

export const SubscriptionAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getSubscriptionAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load subscription analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  const planColors = {
    free: 'bg-gray-100 text-gray-800 border-gray-300',
    basic: 'bg-blue-100 text-blue-800 border-blue-300',
    pro: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Vendor subscription plans and recurring revenue.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Subscriptions</span>
            <CreditCard className="w-5 h-5 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalSubscriptions}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Active Subscriptions</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{data.summary.activeSubscriptions}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Monthly Recurring Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">₹{data.summary.mrr.toLocaleString()}</p>
        </div>
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
          Plan Distribution
        </h2>
        {data.planBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.planBreakdown.map((plan, idx) => (
              <div key={idx} className={`p-6 rounded-xl border-2 ${planColors[plan._id?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                <h3 className="text-lg font-bold mb-2 capitalize">{plan._id || 'Unknown'} Plan</h3>
                <p className="text-3xl font-bold mb-1">{plan.count}</p>
                <p className="text-sm opacity-75">vendors</p>
                <div className="mt-4 pt-4 border-t border-current opacity-50">
                  <p className="text-sm">Revenue</p>
                  <p className="text-xl font-bold">₹{plan.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No subscription data available.</p>
        )}
      </div>
    </div>
  );
};