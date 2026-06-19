import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { Package, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const ProductAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await analyticsService.getProductAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load product analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide product performance overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <Package className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Total Products</p>
          <p className="text-xl font-bold text-gray-900">{data.summary.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-600">{data.summary.activeProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <Clock className="w-5 h-5 text-yellow-600 mb-2" />
          <p className="text-xs text-gray-500">Drafts</p>
          <p className="text-xl font-bold text-yellow-600">{data.summary.draftProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <XCircle className="w-5 h-5 text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-gray-600">{data.summary.inactiveProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <AlertTriangle className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-xs text-gray-500">Low Stock</p>
          <p className="text-xl font-bold text-orange-600">{data.summary.lowStockProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <XCircle className="w-5 h-5 text-red-600 mb-2" />
          <p className="text-xs text-gray-500">Out of Stock</p>
          <p className="text-xl font-bold text-red-600">{data.summary.outOfStock}</p>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products (Platform-wide)</h2>
        {data.topProducts.length > 0 ? (
          <div className="space-y-3">
            {data.topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {item._id?.images?.[0]?.url ? (
                    <img src={item._id.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item._id?.title || 'Unknown Product'}
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    <span>{item.totalSold} sold</span>
                    <span>•</span>
                    <span className="font-semibold text-green-600">₹{item.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No sales data available.</p>
        )}
      </div>
    </div>
  );
};