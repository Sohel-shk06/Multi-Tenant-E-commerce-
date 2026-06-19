import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Star, Package } from 'lucide-react';

export const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // 🔗 REPLACE THESE WITH YOUR ACTUAL API URLS
  // ==========================================
  const CATEGORY_API_URL = `http://localhost:5000/api/categories/${categoryId}`;
  const PRODUCTS_API_URL = `http://localhost:5000/api/products?category=${categoryId}`;

  /**
   * Separate function to fetch category info and its products from the backend.
   * Attaches Authorization JWT token if it exists in localStorage.
   */
  const loadCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Execute both requests concurrently
      const [categoryRes, productsRes] = await Promise.all([
        axios.get(CATEGORY_API_URL, { headers }),
        axios.get(PRODUCTS_API_URL, { headers })
      ]);

      // Parse backend responses
      const fetchedCategory = categoryRes.data?.data || categoryRes.data || null;
      const fetchedProducts = productsRes.data?.data?.products || productsRes.data?.data || productsRes.data || [];

      setCategory(fetchedCategory);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to load category products:', err);
      setError('Failed to fetch products for this category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Run data loading logic on mount and when categoryId changes.
   */
  useEffect(() => {
    loadCategoryAndProducts();
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Separate handler to navigate back to category list.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * Separate handler to navigate to product details page.
   * Reads data-id attribute to avoid inline arrow functions.
   */
  const handleProductClick = (event) => {
    const productId = event.currentTarget.dataset.id;
    navigate(`/products/${productId}`);
  };

  // Loading state rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error alert rendering
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={loadCategoryAndProducts} 
            className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={handleGoBack}
            className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
            title="Back to Categories"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {category?.name || 'Category Products'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {category?.description || 'Browse products related to this department'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                data-id={product._id}
                onClick={handleProductClick}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <Package className="w-12 h-12 mb-2" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}

                  {/* Stock Warning Badge */}
                  {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">
                    {product.store?.name || 'Official Merchant'}
                  </span>
                  
                  <h3 className="font-bold text-gray-900 text-base line-clamp-2 mt-1.5 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Rating indicator */}
                  <div className="flex items-center mt-2.5 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold text-gray-700 ml-1">
                      {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({product.totalReviews || 0})
                    </span>
                  </div>

                  {/* Price & Discount info */}
                  <div className="flex items-baseline space-x-2 mt-auto pt-5">
                    <span className="text-lg font-extrabold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.comparePrice > product.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.comparePrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-500 text-sm mt-1">There are no active products in this category at the moment.</p>
          </div>
        )}

      </div>
    </div>
  );
};
