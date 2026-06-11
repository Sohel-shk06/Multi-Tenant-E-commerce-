import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { fetchVendorStats, fetchVendorRevenueChart, fetchVendorRecentOrders } from '../../../app/store/vendorDashboardSlice';
import { Package, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { stats, chartData, recentOrders, isLoading, error } = useSelector((state) => state.vendorDashboard);

  useEffect(() => {
    dispatch(fetchVendorStats());
    dispatch(fetchVendorRevenueChart());
    dispatch(fetchVendorRecentOrders());
  }, [dispatch]);

  // Loading state
  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Stats data array
  const statsData = [
    { 
      title: 'Total Products', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: 'blue',
      link: '/vendor/products'
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart, 
      color: 'green',
      link: '/vendor/orders'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'purple',
      link: '/vendor/earnings'
    },
    { 
      title: 'Low Stock Items', 
      value: stats?.lowStockProducts || 0, 
      icon: AlertTriangle, 
      color: 'orange',
      link: '/vendor/products'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
        </div>
        <Link 
          to="/vendor/products/create" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              to={stat.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.title === 'Total Revenue' && (
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Charts & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <span className="text-xs text-gray-500">Monthly</span>
          </div>
          <div className="h-64">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12}
                    tickFormatter={(value) => `₹${value >= 1000 ? `${value/1000}k` : value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#16a34a" 
                    radius={[4, 4, 0, 0]}
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

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/vendor/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link 
                  key={order._id}
                  to={`/vendor/orders/${order._id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{order.customer?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent orders found.</p>
                <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers place them.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/vendor/products" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
            <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">My Products</p>
          </Link>
          <Link to="/vendor/orders" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
            <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Orders</p>
          </Link>
          <Link to="/vendor/stores" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">My Stores</p>
          </Link>
          <Link to="/vendor/analytics" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <ArrowUpRight className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};