
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { categoryService } from '../../../services/category.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { 
  Search, SlidersHorizontal, Package, ChevronLeft, 
  ChevronRight, Heart, ShoppingCart, Star, Grid, List, 
  X, Filter, ChevronDown, Check
} from 'lucide-react';

export const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== 'newest').length;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts({
            page: searchParams.get('page') || 1,
            limit: 12,
            search: searchParams.get('search') || '',
            category: searchParams.get('category') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            sort: searchParams.get('sort') || 'newest',
          }),
          categoryService.getCategories()
        ]);
        setProducts(productsRes.products || []);
        setPagination({
          currentPage: productsRes.currentPage,
          totalPages: productsRes.totalPages,
          totalProducts: productsRes.totalProducts
        });
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  // Close bottom sheet on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileFiltersOpen]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('page', '1');
    
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) newSearchParams.set(k, newFilters[k]);
    });
    setSearchParams(newSearchParams);
  };

  const handleCategoryCheckboxChange = (catId) => {
    const newCat = filters.category === catId ? '' : catId;
    handleFilterChange('category', newCat);
  };

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage);
    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      alert('This product is out of stock.');
      return;
    }

    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || '',
      store: product.store,
      stock: product.stock
    };

    dispatch(addToCart(cartItem));
    alert(`✨ Added "${product.title}" to cart!`);
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(toggleWishlist({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || '',
    }));
  };

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('page', '1');
    Object.keys(filters).forEach(k => {
      if (filters[k]) newSearchParams.set(k, filters[k]);
    });
    setSearchParams(newSearchParams);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Header Section - Improved */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2F] tracking-tight">Marketplace Catalog</h1>
              <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-1">Discover premium items uploaded by our authorized sellers.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Button with Badge */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-white border border-[#E9E7F5] rounded-xl text-sm font-bold text-[#1E1E2F] shadow-sm active:scale-95 transition-transform relative"
            >
              <Filter className="w-4 h-4 text-[#6C4DF6]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#6C4DF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Filter Chips - Horizontal Scroll */}
            <div className="flex-1 lg:flex hidden overflow-x-auto no-scrollbar space-x-2 ml-4">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleFilterChange('category', filters.category === cat._id ? '' : cat._id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filters.category === cat._id
                      ? 'bg-[#6C4DF6] text-white shadow-md'
                      : 'bg-white text-[#6B7280] border border-[#E9E7F5] hover:border-[#6C4DF6]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider hidden sm:inline">Sort</span>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white border border-[#E9E7F5] rounded-xl text-xs font-bold text-[#1E1E2F] focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low</option>
                  <option value="price_desc">Price: High</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="flex items-center bg-white border border-[#E9E7F5] rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-[#EEE9FF] text-[#6C4DF6]' : 'text-[#6B7280]'
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-[#EEE9FF] text-[#6C4DF6]' : 'text-[#6B7280]'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Mobile Bottom Sheet Filter */}
          {mobileFiltersOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFiltersOpen(false)}
            />
          )}

          {/* Bottom Sheet */}
          <div 
            ref={bottomSheetRef}
            className={`
              fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[60] 
              transform transition-transform duration-300 ease-out lg:hidden
              max-h-[85vh] overflow-hidden flex flex-col
              ${mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'}
            `}
          >
            {/* Drag Handle */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4 border-b border-[#E9E7F5]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-[#6C4DF6]" />
                <h2 className="text-lg font-bold text-[#1E1E2F]">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#EEE9FF] text-[#6C4DF6] text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Category</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      filters.category === '' 
                        ? 'bg-[#6C4DF6] text-white' 
                        : 'bg-[#F8F7FC] text-[#6B7280]'
                    }`}
                  >
                    <span>All Categories</span>
                    {filters.category === '' && <Check className="w-4 h-4" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleFilterChange('category', cat._id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        filters.category === cat._id 
                          ? 'bg-[#6C4DF6] text-white' 
                          : 'bg-[#F8F7FC] text-[#6B7280]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {filters.category === cat._id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Price Range (₹)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="Min"
                    className="w-full px-3.5 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25"
                  />
                  <span className="text-[#6B7280] font-bold">-</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="Max"
                    className="w-full px-3.5 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Footer Buttons */}
            <div className="border-t border-[#E9E7F5] p-4 bg-white space-y-2">
              <button
                onClick={applyFilters}
                className="w-full py-3 bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform"
              >
                Apply Filters ({activeFiltersCount})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-3 bg-[#F8F7FC] text-[#6C4DF6] font-bold rounded-xl active:scale-95 transition-transform"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-[24px] shadow-sm border border-[#E9E7F5] p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9E7F5]">
                <div className="flex items-center space-x-2.5">
                  <SlidersHorizontal className="w-5 h-5 text-[#6C4DF6]" />
                  <h2 className="text-lg font-bold text-[#1E1E2F]">Filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 bg-[#EEE9FF] text-[#6C4DF6] text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Search</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Price (₹)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="w-full py-3 text-sm text-white font-bold bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] rounded-xl shadow-md hover:opacity-95 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6C4DF6]"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-xs font-bold text-[#6B7280] uppercase">{pagination.totalProducts} Products</p>
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {products.map((product) => {
                      const isInWish = wishlist.some((item) => item.productId === product._id);
                      return (
                        <Link key={product._id} to={`/products/${product._id}`} className="group block">
                          <div className="bg-white rounded-[20px] border border-[#E9E7F5] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all h-full flex flex-col">
                            <div className="relative h-48 sm:h-56 bg-[#F8F7FC] overflow-hidden">
                              <button
                                onClick={(e) => handleWishlistToggle(e, product)}
                                className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all ${
                                  isInWish ? 'bg-[#6C4DF6] text-white' : 'bg-white text-[#6B7280]'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isInWish ? 'fill-current' : ''}`} />
                              </button>
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-[10px] font-extrabold text-[#6C4DF6] uppercase mb-1">{product.store?.name}</p>
                                <h3 className="text-sm font-bold text-[#1E1E2F] line-clamp-2 mb-2">{product.title}</h3>
                                <div className="flex items-center space-x-1 text-yellow-400 mb-3">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-xs font-semibold">{product.averageRating?.toFixed(1) || '0.0'}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-base font-extrabold text-[#6C4DF6]">₹{product.price.toLocaleString()}</span>
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="mt-3 w-full py-2 bg-[#EEE9FF] text-[#6C4DF6] hover:bg-[#6C4DF6] hover:text-white rounded-xl text-xs font-extrabold transition-all"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {products.map((product) => {
                      const isInWish = wishlist.some((item) => item.productId === product._id);
                      return (
                        <Link key={product._id} to={`/products/${product._id}`} className="group block">
                          <div className="bg-white rounded-[20px] border border-[#E9E7F5] overflow-hidden hover:shadow-lg transition-all flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-60 h-48 sm:h-52 bg-[#F8F7FC] overflow-hidden">
                              <button
                                onClick={(e) => handleWishlistToggle(e, product)}
                                className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md ${
                                  isInWish ? 'bg-[#6C4DF6] text-white' : 'bg-white'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isInWish ? 'fill-current' : ''}`} />
                              </button>
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-12 h-12 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold text-[#6C4DF6] uppercase">{product.store?.name}</span>
                                <h3 className="text-lg font-bold text-[#1E1E2F] mt-1">{product.title}</h3>
                                <p className="text-sm text-[#6B7280] mt-2 line-clamp-2">{product.description}</p>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-extrabold text-[#6C4DF6]">₹{product.price.toLocaleString()}</span>
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="py-2 px-6 bg-[#EEE9FF] text-[#6C4DF6] hover:bg-[#6C4DF6] hover:text-white rounded-xl text-sm font-extrabold transition-all"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-6">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 sm:p-2.5 border border-[#E9E7F5] bg-white rounded-xl disabled:opacity-40 hover:bg-[#EEE9FF] transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold px-4 py-2 bg-white border border-[#E9E7F5] rounded-xl">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 sm:p-2.5 border border-[#E9E7F5] bg-white rounded-xl disabled:opacity-40 hover:bg-[#EEE9FF] transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 sm:py-20 bg-white rounded-[20px] border border-[#E9E7F5]">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1E1E2F]">No products found</h3>
                <p className="text-sm text-[#6B7280] mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};