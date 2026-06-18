import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../../services/category.service';
import { ArrowRight, Package } from 'lucide-react';
import { TrendingProducts } from './TrendingProducts';
import { NewArrivals } from './NewArrivals';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesRes = await categoryService.getCategories();
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Discover Amazing Products from Top Vendors</h1>
            <p className="text-lg text-blue-100 mb-8">Shop the latest trends, electronics, fashion, and more. All in one trusted marketplace.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link 
                key={cat._id} 
                to={`/products?category=${cat._id}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trending Products Section */}
      <TrendingProducts />

      {/* New Arrivals Section */}
      <NewArrivals />
    </div>
  );
};