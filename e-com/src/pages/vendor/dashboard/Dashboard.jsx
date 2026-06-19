import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  fetchVendorStats,
  fetchVendorRevenueChart,
  fetchVendorRecentOrders,
} from "../../../app/store/vendorDashboardSlice";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { vendorService } from '../../../services/vendor.service';
//component
import OrderStatusChart from "./OrderStatusChart";
import RevenueChart from "./RevenueChart";
import TopProducts from "./TopProducts";
import InventoryAlerts from "./InventoryAlerts";
import DashboardHero from "./DashboardHero";
import RecentOrders from "./RecentOrders";

export const Dashboard = () => {
  
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { stats, chartData, recentOrders, isLoading, error } = useSelector(
    (state) => state.vendorDashboard,
  );

  const loadData = async () => {
    try {
      const result = await vendorService.getProductAnalytics();
      setData(result);
      // console.log('dash data',result.topProducts)
    } catch (error) {
      console.error('Failed to load product analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchVendorStats());
    dispatch(fetchVendorRevenueChart());
    dispatch(fetchVendorRecentOrders());
    loadData();
  }, [dispatch]);

  // Loading state
  if (isLoading && !stats && !chartData && !recentOrders) {
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

  // Access products from vendorProducts slice for InventoryAlerts
  // console.log("data:-",data);
const { products } = useSelector((state) => state.vendorProducts);

  const lowStockProducts = products.filter((product) => product.stock <= 10);

  const topProducts = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  // Stats data array
  const statsData = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "blue",
      link: "/vendor/products",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "green",
      link: "/vendor/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      link: "/vendor/earnings",
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: "orange",
      link: "/vendor/products",
    },
  ];
  // console.log("Stats Data:", stats.totalOrders);

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <DashboardHero user={user} recentOrders={recentOrders} />

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
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {stat.title === "Total Revenue" && (
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Charts & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <RevenueChart chartData={chartData} />
        </div>

        <div className="lg:col-span-1 h-full">
          <OrderStatusChart />
        </div>
      </div>

      {/* Top Products & Inventory Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="lg:col-span-1">
          <TopProducts 
          products={data?.topProducts} 
          totalOrder={stats?.totalOrders}
          />
        </div>

        <div className="lg:col-span-1">
          <InventoryAlerts products={data?.lowStockProducts} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrders orders={recentOrders} />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/vendor/products"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">My Products</p>
          </Link>
          <Link
            to="/vendor/orders"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
          >
            <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Orders</p>
          </Link>
          <Link
            to="/vendor/stores"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">My Stores</p>
          </Link>
          <Link
            to="/vendor/analytics"
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
          >
            <ArrowUpRight className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
