import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { Star, TrendingUp, MessageSquare, Package, BarChart3 } from 'lucide-react';

export const ReviewAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await vendorService.getReviewAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-6 text-center text-gray-500">Failed to load analytics.</div>;
  }

  const getPercentage = (count) => {
    const total = Object.values(analytics.ratingDistribution).reduce((a, b) => a + b, 0);
    return total > 0 ? (count / total) * 100 : 0;
  };

  const replyRate = analytics.totalReviews > 0 
    ? ((analytics.repliedCount / analytics.totalReviews) * 100).toFixed(1) 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Insights into customer feedback for your products.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Total Reviews</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalReviews}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Average Rating</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
          <div className="flex items-center space-x-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(analytics.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Reply Rate</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{replyRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.repliedCount} of {analytics.totalReviews} replied</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Unreplied</span>
            <div className="p-2 bg-orange-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.unrepliedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Needs your attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
            Rating Distribution
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${getPercentage(analytics.ratingDistribution[star])}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {analytics.ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reviewed Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-500" />
            Most Reviewed Products
          </h2>
          {analytics.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.map((product, idx) => (
                <div key={product._id?._id || idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
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
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{product.count} reviews</span>
                      <span className="text-xs text-gray-500">•</span>
                      <div className="flex items-center space-x-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-700">{product.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products reviewed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};