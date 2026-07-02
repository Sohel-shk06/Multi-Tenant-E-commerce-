import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { categoryService } from '../../../services/category.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { 
  Search, SlidersHorizontal, Package, ChevronLeft, 
  ChevronRight, Heart, ShoppingCart, Star, Grid, List 
} from 'lucide-react';

export const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

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
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newSearchParams = new URLSearchParams();
    // Keep page 1 on search filter change
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

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E1E2F] tracking-tight">Marketplace Catalog</h1>
            <p className="text-sm text-[#6B7280] font-medium mt-1">Discover premium items uploaded by our authorized sellers.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Sort By</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-[#E9E7F5] rounded-xl text-xs font-bold text-[#1E1E2F] focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-white border border-[#E9E7F5] rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-[#EEE9FF] text-[#6C4DF6]'
                    : 'text-[#6B7280] hover:text-[#6C4DF6]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-[#EEE9FF] text-[#6C4DF6]'
                    : 'text-[#6B7280] hover:text-[#6C4DF6]'
                }`}
                title="List View"
              >
                <List className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Filters Button */}
        <button
          type="button"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="lg:hidden w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-[#E9E7F5]/90 rounded-xl text-sm font-bold text-[#1E1E2F] shadow-sm hover:bg-[#F8F7FC] transition-all duration-200 mb-6 cursor-pointer"
        >
          <SlidersHorizontal className="w-4.5 h-4.5 text-[#6C4EFF]" />
          <span>{showFiltersMobile ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - White Rounded 24px Card */}
          <div className={`w-full lg:w-72 flex-shrink-0 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-[24px] shadow-sm border border-[#E9E7F5] p-6 sticky top-24 text-left">
              <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-[#E9E7F5]">
                <SlidersHorizontal className="w-5 h-5 text-[#6C4DF6]" />
                <h2 className="text-lg font-bold text-[#1E1E2F]">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Search Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Type name, store..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] transition-all text-[#1E1E2F] placeholder-[#6B7280]/60 font-medium"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Quick Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] bg-white transition-all text-[#1E1E2F] font-semibold"
                >
                  <option value="">All Collections</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Slider/Range Inputs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2.5">Price Range (₹)</label>
                <div className="flex items-center space-x-2.5">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3.5 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm text-[#1E1E2F] focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] transition-all font-medium"
                  />
                  <span className="text-[#6B7280] font-bold">-</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3.5 py-2.5 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm text-[#1E1E2F] focus:outline-none focus:ring-2 focus:ring-[#6C4DF6]/25 focus:border-[#6C4DF6] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Category Checkboxes List */}
              {categories.length > 0 && (
                <div className="mb-8 border-t border-[#E9E7F5] pt-5">
                  <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-3">Filter Collections</label>
                  <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.category === cat._id}
                          onChange={() => handleCategoryCheckboxChange(cat._id)}
                          className="w-4.5 h-4.5 rounded border-[#E9E7F5] text-[#6C4DF6] focus:ring-[#6C4DF6]/40 transition-colors"
                        />
                        <span className="text-sm font-semibold text-[#6B7280] group-hover:text-[#6C4DF6] transition-colors">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters Button - Lavender/Purple Gradient */}
              <button
                onClick={() => {
                  setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
                  setSearchParams({});
                }}
                className="w-full py-3 text-sm text-white font-bold bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] rounded-xl shadow-md hover:shadow-glow hover:opacity-95 transform active:scale-95 transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid / List Container */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4DF6]"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-4 text-left">
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{pagination.totalProducts} Premium Products Listed</p>
                </div>
                
                {viewMode === 'grid' ? (
                  /* Grid View - 4 columns desktop */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {products.map((product) => {
                      const isInWish = wishlist.some((item) => item.productId === product._id);
                      return (
                        <Link 
                          key={product._id} 
                          to={`/products/${product._id}`} 
                          className="group block"
                        >
                          <div className="bg-white rounded-[22px] border border-[#E9E7F5] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between">
                            {/* Image Wrapper */}
                            <div className="relative h-56 bg-[#F8F7FC] overflow-hidden flex items-center justify-center">
                              {/* Wishlist Icon */}
                              <button
                                onClick={(e) => handleWishlistToggle(e, product)}
                                className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-115 ${
                                  isInWish
                                    ? 'bg-[#6C4DF6] text-white'
                                    : 'bg-white text-[#6B7280] hover:text-red-500 hover:bg-gray-50'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isInWish ? 'fill-current' : ''}`} />
                              </button>

                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                            </div>
                            
                            {/* Content Details */}
                            <div className="p-4.5 flex-1 flex flex-col justify-between text-left">
                              <div>
                                <p className="text-[10px] font-extrabold text-[#6C4DF6] tracking-widest uppercase mb-1">{product.store?.name}</p>
                                <h3 className="text-sm font-bold text-[#1E1E2F] line-clamp-2 mb-2 group-hover:text-[#6C4DF6] transition-colors">
                                  {product.title}
                                </h3>
                                
                                {/* Rating */}
                                <div className="flex items-center space-x-1 text-yellow-400 mb-3.5">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-xs font-semibold text-[#1E1E2F]">{product.averageRating?.toFixed(1) || '0.0'}</span>
                                  <span className="text-[10px] text-[#6B7280]">({product.totalReviews || 0})</span>
                                </div>
                              </div>
                              
                              <div>
                                {/* Price */}
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-base font-extrabold text-[#6C4DF6]">₹{product.price.toLocaleString()}</span>
                                  {product.comparePrice > product.price && (
                                    <span className="text-xs text-[#6B7280] line-through font-medium">₹{product.comparePrice.toLocaleString()}</span>
                                  )}
                                </div>
                                
                                {/* Add to Cart Action */}
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="mt-3.5 w-full py-2 bg-[#EEE9FF] text-[#6C4DF6] hover:bg-[#6C4DF6] hover:text-white rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center space-x-1.5 hover:shadow-glow"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  /* List View Mode - Rows */
                  <div className="space-y-6 mb-10">
                    {products.map((product) => {
                      const isInWish = wishlist.some((item) => item.productId === product._id);
                      return (
                        <Link 
                          key={product._id} 
                          to={`/products/${product._id}`} 
                          className="group block"
                        >
                          <div className="bg-white rounded-[22px] border border-[#E9E7F5] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row text-left">
                            {/* Left Image */}
                            <div className="relative w-full sm:w-60 h-52 bg-[#F8F7FC] overflow-hidden shrink-0 flex items-center justify-center">
                              {/* Wishlist Icon */}
                              <button
                                onClick={(e) => handleWishlistToggle(e, product)}
                                className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-115 ${
                                  isInWish
                                    ? 'bg-[#6C4DF6] text-white'
                                    : 'bg-white text-[#6B7280] hover:text-red-500 hover:bg-gray-50'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isInWish ? 'fill-current' : ''}`} />
                              </button>

                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                            </div>

                            {/* Details Column */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold text-[#6C4DF6] tracking-widest uppercase">{product.store?.name}</span>
                                <h3 className="text-lg font-bold text-[#1E1E2F] mt-1 group-hover:text-[#6C4DF6] transition-colors">
                                  {product.title}
                                </h3>
                                <p className="text-sm text-[#6B7280] font-medium line-clamp-2 mt-2 leading-relaxed">
                                  {product.description || 'No description available for this item.'}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-baseline space-x-2">
                                    <span className="text-xl font-extrabold text-[#6C4DF6]">₹{product.price.toLocaleString()}</span>
                                    {product.comparePrice > product.price && (
                                      <span className="text-sm text-[#6B7280] line-through font-medium">₹{product.comparePrice.toLocaleString()}</span>
                                    )}
                                  </div>
                                  
                                  {/* Rating */}
                                  <div className="flex items-center space-x-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-semibold text-[#1E1E2F]">{product.averageRating?.toFixed(1) || '0.0'}</span>
                                    <span className="text-xs text-[#6B7280]">({product.totalReviews || 0})</span>
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="py-2.5 px-6 bg-[#EEE9FF] text-[#6C4DF6] hover:bg-[#6C4DF6] hover:text-white rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-glow"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-3 mt-6">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2.5 border border-[#E9E7F5] bg-white text-[#1E1E2F] hover:text-[#6C4DF6] rounded-xl disabled:opacity-40 disabled:pointer-events-none hover:bg-[#EEE9FF] hover:border-[#6C4DF6] transform active:scale-95 transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-[#1E1E2F] bg-white border border-[#E9E7F5] px-4.5 py-2.5 rounded-xl">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2.5 border border-[#E9E7F5] bg-white text-[#1E1E2F] hover:text-[#6C4DF6] rounded-xl disabled:opacity-40 disabled:pointer-events-none hover:bg-[#EEE9FF] hover:border-[#6C4DF6] transform active:scale-95 transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-[24px] border border-[#E9E7F5] shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1E1E2F]">No products found</h3>
                <p className="text-sm text-[#6B7280] mt-2 font-medium">Try adjusting your keyword filters, category collections, or price ranges.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};