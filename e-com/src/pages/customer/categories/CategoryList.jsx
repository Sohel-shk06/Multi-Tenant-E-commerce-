import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Folder, ChevronRight, Layers } from 'lucide-react';

export const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // 🔗 REPLACE THIS WITH YOUR ACTUAL API URL 
  // ==========================================
  const CATEGORIES_API_URL = 'http://localhost:5000/api/categories';

  /**
   * Separate function to fetch categories from the backend API.
   * Attaches Authorization JWT token if it exists in localStorage.
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(CATEGORIES_API_URL, { headers });
      
      // Parse categories based on backend response data structure
      const fetchedCategories = response.data?.data?.categories || response.data?.data || response.data || [];
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Run the fetching logic inside useEffect on component mount.
   */
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Separate handler to navigate back to the previous page.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * Separate handler to navigate to products of a specific category.
   * Obtains categoryId via HTML5 dataset attributes to avoid inline functions.
   */
  const handleCategoryClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;
    navigate(`/categories/${categoryId}`);
  };

  // Loading indicator rendering
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
            onClick={loadCategories} 
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
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Product Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse products by their departments and collections
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div 
                key={category._id}
                data-id={category._id}
                onClick={handleCategoryClick}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all duration-200 group flex items-start space-x-4"
              >
                {/* Visual Image / Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Layers className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                    {category.description || 'Explore our collection of quality items in this department.'}
                  </p>
                </div>

                {/* Arrow indicator */}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors self-center" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
            <p className="text-gray-500 text-sm mt-1">Check back later for new product updates.</p>
          </div>
        )}

      </div>
    </div>
  );
};
