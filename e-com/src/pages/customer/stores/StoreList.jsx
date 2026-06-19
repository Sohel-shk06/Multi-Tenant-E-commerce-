import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storeService } from '../../../services/store.service';
import { Search, Store as StoreIcon, Package, ChevronLeft, ChevronRight } from 'lucide-react';

export const StoreList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalStores: 0 });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadStores();
  }, [searchParams]);

  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await storeService.getPublicStores({
        page: searchParams.get('page') || 1,
        limit: 12,
        search: searchParams.get('search') || ''
      });
      setStores(data.stores || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalStores: data.totalStores
      });
    } catch (error) {
      console.error('Failed to load stores', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Stores</h1>
          <p className="text-gray-500 mt-1">{pagination.totalStores} stores available</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Stores Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : stores.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stores.map((store) => (
                <Link 
                  key={store._id} 
                  to={`/stores/${store._id}`} 
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    {/* Store Header */}
                    <div className="h-24 relative bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
                      {store.banner ? (
                        <img 
                          src={store.banner} 
                          alt={`${store.name} banner`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
                      )}
                      <div className="absolute -bottom-8 left-6 z-10">
                        <div className="w-16 h-16 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                          {store.logo ? (
                            <img 
                              src={store.logo} 
                              alt={`${store.name} logo`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <StoreIcon className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="pt-12 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {store.name}
                      </h3>
                      {store.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {store.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Package className="w-4 h-4" />
                          <span>View Products</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          by {store.vendor?.name || 'Vendor'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No stores found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};