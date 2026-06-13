import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { TrendingUp, Package, ShoppingBag, Users, ArrowRight } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await vendorService.getSalesAnalytics();
      setSalesData(data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  const analyticsCards = [
    { title: 'Revenue Analytics', desc: 'Track revenue trends over time', icon: TrendingUp, path: '/vendor/analytics/revenue', color: 'green' },
    { title: 'Sales Overview', desc: 'Quick sales snapshot', icon: TrendingUp, path: '/vendor/analytics/sales', color: 'blue' },
    { title: 'Product Analytics', desc: 'Top products & stock insights', icon: Package, path: '/vendor/analytics/products', color: 'purple' },
    { title: 'Order Analytics', desc: 'Order status & payment breakdown', icon: ShoppingBag, path: '/vendor/analytics/orders', color: 'orange' },
    { title: 'Customer Analytics', desc: 'Customer behavior & retention', icon: Users, path: '/vendor/analytics/customers', color: 'pink' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive insights into your business performance.</p>
      </div>

      {/* Quick Stats */}
      {salesData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white">
            <p className="text-green-100 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold mt-1">₹{salesData.today.revenue.toLocaleString()}</p>
            <p className="text-green-100 text-xs mt-2">{salesData.today.orders} orders today</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{salesData.thisMonth.revenue.toLocaleString()}</p>
            <p className={`text-xs mt-2 ${salesData.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesData.growth.revenue >= 0 ? '↑' : '↓'} {Math.abs(salesData.growth.revenue)}% vs last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm">Orders This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{salesData.thisMonth.orders}</p>
            <p className={`text-xs mt-2 ${salesData.growth.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesData.growth.orders >= 0 ? '↑' : '↓'} {Math.abs(salesData.growth.orders)}% vs last month
            </p>
          </div>
        </div>
      )}

      {/* Analytics Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${card.color}-50 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};