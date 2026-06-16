import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storeService } from '../../../services/store.service';
import { ArrowLeft, Store as StoreIcon, Package, Mail, Phone } from 'lucide-react';

export const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      const [storeData, productsData] = await Promise.all([
        storeService.getPublicStore(storeId),
        storeService.getStoreProducts(storeId, { page: 1, limit: 20 })
      ]);
      setStore(storeData);
      setProducts(productsData.products || []);
      setPagination({
        currentPage: productsData.currentPage,
        totalPages: productsData.totalPages
      });
    } catch (error) {
      console.error('Failed to load store data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Store not found</h2>
        <Link to="/stores" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <StoreIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
              {store.description && (
                <p className="text-lg text-white/90">{store.description}</p>
              )}
              <p className="text-sm text-white/70 mt-2">
                by {store.vendor?.name || 'Vendor'}
              </p>
            </div>
          </div>

          {/* Store Info */}
          {store.settings && (
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/20">
              {store.settings.contactEmail && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{store.settings.contactEmail}</span>
                </div>
              )}
              {store.settings.contactPhone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{store.settings.contactPhone}</span>
                </div>
              )}
              {store.settings.returnPolicy && (
                <div className="text-sm">
                  <span className="font-semibold">Return Policy:</span> {store.settings.returnPolicy}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products from this Store</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`} 
                className="group"
              >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-56 bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors flex-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-auto">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No products available</h3>
            <p className="text-gray-500 mt-2">This store doesn't have any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};