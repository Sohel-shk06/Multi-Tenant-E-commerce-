

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storeService } from '../../../services/store.service';
import { Search, Store as StoreIcon, Package, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8F7FC] pb-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E1E2F] tracking-tight">
            All Stores
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#6B7280] mt-1.5">
            {pagination.totalStores} stores available
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores..."
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 border border-[#E9E7F5] rounded-xl bg-white text-sm text-[#1E1E2F] placeholder-[#6B7280]/60 focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF] transition-all"
            />
          </div>
        </form>

        {/* Stores Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6C4EFF]"></div>
          </div>
        ) : stores.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {stores.map((store) => (
                <Link
                  key={store._id}
                  to={`/stores/${store._id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-[#E9E7F5] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Store Header */}
                    <div className="h-24 sm:h-28 relative overflow-hidden">
                      {store.banner ? (
                        <img
                          src={store.banner}
                          alt={`${store.name} banner`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6C4EFF] via-[#7C5CFF] to-[#9477FF]" />
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                      {/* Store Logo */}
                      <div className="absolute -bottom-8 left-4 sm:left-6 z-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                          {store.logo ? (
                            <img
                              src={store.logo}
                              alt={`${store.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <StoreIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#6C4EFF]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="pt-10 sm:pt-12 p-4 sm:p-6 flex-1 flex flex-col text-left">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-[#1E1E2F] mb-2 group-hover:text-[#6C4EFF] transition-colors line-clamp-1">
                          {store.name}
                        </h3>
                        
                        {store.description && (
                          <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 mb-4 leading-relaxed">
                            {store.description}
                          </p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#E9E7F5]">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-[#6B7280] group-hover:text-[#6C4EFF] transition-colors">
                          <Package className="w-4 h-4 flex-shrink-0" />
                          <span>View Products</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-[#6B7280]">
                          <span className="hidden sm:inline">by</span>
                          <span className="font-semibold text-[#1E1E2F] line-clamp-1">
                            {store.vendor?.name || 'Vendor'}
                          </span>
                        </div>
                      </div>

                      {/* Arrow Icon - Appears on Hover */}
                      <div className="absolute top-1/2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-[#6C4EFF]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 sm:p-2.5 border border-[#E9E7F5] bg-white rounded-xl disabled:opacity-50 hover:bg-[#EEE9FF] hover:text-[#6C4EFF] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="text-xs sm:text-sm font-bold text-[#1E1E2F] bg-white border border-[#E9E7F5] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 sm:p-2.5 border border-[#E9E7F5] bg-white rounded-xl disabled:opacity-50 hover:bg-[#EEE9FF] hover:text-[#6C4EFF] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-[#E9E7F5] shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EEE9FF] text-[#6C4EFF] mx-auto mb-5 flex items-center justify-center">
              <StoreIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1E1E2F] mb-2">No stores found</h3>
            <p className="text-xs sm:text-sm font-medium text-[#6B7280]">
              {searchTerm 
                ? `No stores matching "${searchTerm}"`
                : 'Try adjusting your search terms'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};