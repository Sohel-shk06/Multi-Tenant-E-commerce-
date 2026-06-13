import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { Package, AlertTriangle, Star, TrendingUp, ShoppingBag } from 'lucide-react';

export const ProductAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getProductAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load product analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!data) return <div className="p-6 text-gray-500">Failed to load data.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Insights into your product performance.</p>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Total Products</p>
          <p className="text-xl font-bold text-gray-900">{data.stats.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Active</p>
          <p className="text-xl font-bold text-green-600">{data.stats.activeProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Drafts</p>
          <p className="text-xl font-bold text-yellow-600">{data.stats.draftProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Total Stock</p>
          <p className="text-xl font-bold text-gray-900">{data.stats.totalStock}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Stock Value</p>
          <p className="text-xl font-bold text-blue-600">₹{data.stats.totalStockValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Top Selling Products
          </h2>
          {data.topProducts.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product._id?.images?.[0]?.url ? (
                      <img src={product._id.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product._id?.title}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span>{product.totalSold} sold</span>
                      <span>•</span>
                      <span className="font-semibold text-green-600">₹{product.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No sales yet.</p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Low Stock Alert
          </h2>
          {data.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {data.lowStockProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                      {product.stock} left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">All products are well stocked! ✅</p>
          )}
        </div>
      </div>

      {/* Products without reviews */}
      {data.productsWithoutReviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Products Needing Reviews
          </h2>
          <p className="text-sm text-gray-500 mb-4">These products have no reviews yet. Encourage customers to review!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.productsWithoutReviews.map((product, idx) => (
              <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                <p className="text-xs text-gray-500 mt-1">₹{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};