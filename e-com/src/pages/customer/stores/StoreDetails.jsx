

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeService } from '../../../services/store.service';
import { toggleWishlist } from '../../../app/store/cartSlice';
import { 
  ArrowLeft, Store as StoreIcon, Package, Mail, Phone, 
  MapPin, Clock, Shield, Star, Heart, Share2, Search,
  Filter, TrendingUp, Users, Award, MessageCircle,
  ChevronDown, Eye, ShoppingBag, CheckCircle
} from 'lucide-react';

export const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      const [storeData, productsData] = await Promise.all([
        storeService.getPublicStore(storeId),
        storeService.getStoreProducts(storeId, { 
          page: 1, 
          limit: 20,
          search: searchTerm,
          sort: sortBy,
          minPrice: priceRange.min,
          maxPrice: priceRange.max
        })
      ]);
      setStore(storeData);
      setProducts(productsData.products || []);
      setPagination({
        currentPage: productsData.currentPage,
        totalPages: productsData.totalPages,
        totalProducts: productsData.totalProducts
      });
      
      // Check if user is following this store (from user data)
      // This would come from your user profile or a separate API
      setIsFollowing(false); // Replace with actual check
    } catch (error) {
      console.error('Failed to load store data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    // API call to follow/unfollow store
    setIsFollowing(!isFollowing);
    // TODO: Call API to update follow status
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: store.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Store link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStoreData();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setTimeout(() => loadStoreData(), 100);
  };

  const handlePriceFilter = () => {
    loadStoreData();
    setShowFilters(false);
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

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4EFF] mx-auto mb-4"></div>
          <p className="text-sm text-[#6B7280] font-medium">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E9E7F5] max-w-md">
          <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E2F] mb-2">Store not found</h2>
          <p className="text-sm text-[#6B7280] mb-6">The store you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/stores" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Back to Stores
          </Link>
        </div>
      </div>
    );
  }

  // Calculate store stats from products
  const avgRating = products.length > 0 
    ? (products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length).toFixed(1)
    : '0.0';
  
  const totalReviews = products.reduce((sum, p) => sum + (p.totalReviews || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-16 md:pb-8">
      {/* Store Header - Enhanced */}
      <div className="relative text-white overflow-hidden bg-gradient-to-br from-[#6C4EFF] via-[#7C5CFF] to-[#9477FF]">
        {store.banner && (
          <img 
            src={store.banner} 
            alt={store.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 z-10">
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center space-x-2 text-white/90 hover:text-white group transition-colors"
            >
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center space-x-2">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Store</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied!');
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isFollowing
                    ? 'bg-white text-[#6C4EFF]'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white/20">
              {store.logo ? (
                <img 
                  src={store.logo} 
                  alt={`${store.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <StoreIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#6C4EFF]" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {store.verified && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded-full">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold text-green-300">Verified</span>
                  </div>
                )}
                {store.isFeatured && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-bold text-yellow-300">Featured</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 leading-tight">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-sm sm:text-base text-white/90 line-clamp-2 mb-2">
                  {store.description}
                </p>
              )}
              <p className="text-xs sm:text-sm text-white/70 font-medium">
                by {store.vendor?.name || 'Vendor'}
              </p>
            </div>
          </div>

          {/* Store Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Package className="w-4 h-4 text-white/70" />
                <span className="text-xl sm:text-2xl font-bold">{products.length}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 uppercase font-semibold">Products</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xl sm:text-2xl font-bold">{avgRating}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 uppercase font-semibold">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Eye className="w-4 h-4 text-white/70" />
                <span className="text-xl sm:text-2xl font-bold">{totalReviews}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 uppercase font-semibold">Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="w-4 h-4 text-white/70" />
                <span className="text-xl sm:text-2xl font-bold">{store.followersCount || 0}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 uppercase font-semibold">Followers</p>
            </div>
          </div>

          {/* Contact Info */}
          {store.settings && (store.settings.contactEmail || store.settings.contactPhone) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {store.settings.contactEmail && (
                <a 
                  href={`mailto:${store.settings.contactEmail}`}
                  className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/70 uppercase font-bold">Email Us</p>
                    <p className="text-xs sm:text-sm truncate">{store.settings.contactEmail}</p>
                  </div>
                </a>
              )}
              {store.settings.contactPhone && (
                <a 
                  href={`tel:${store.settings.contactPhone}`}
                  className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/70 uppercase font-bold">Call Us</p>
                    <p className="text-xs sm:text-sm truncate">{store.settings.contactPhone}</p>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Section Header with Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1E1E2F]">
              Store Products
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              {pagination.totalProducts} products available
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search in Store */}
            <form onSubmit={handleSearch} className="flex-1 sm:flex-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]"
                />
              </div>
            </form>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters 
                  ? 'bg-[#6C4EFF] text-white border-[#6C4EFF]' 
                  : 'bg-white border-[#E9E7F5] text-[#6B7280] hover:border-[#6C4EFF]'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2.5 bg-white border border-[#E9E7F5] rounded-xl text-sm font-semibold text-[#1E1E2F] focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low</option>
              <option value="price_desc">Price: High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Price Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-[#E9E7F5] shadow-sm">
            <h3 className="text-sm font-bold text-[#1E1E2F] mb-3">Filter by Price</h3>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                placeholder="Min ₹"
                className="flex-1 px-3 py-2 bg-[#F8F7FC] border border-[#E9E7F5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
              />
              <span className="text-[#6B7280]">-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                placeholder="Max ₹"
                className="flex-1 px-3 py-2 bg-[#F8F7FC] border border-[#E9E7F5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
              />
              <button
                onClick={handlePriceFilter}
                className="px-4 py-2 bg-[#6C4EFF] text-white text-sm font-bold rounded-lg hover:bg-[#5A3FE0] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const inWish = isInWishlist(product._id);
              const discount = product.comparePrice > product.price 
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0;

              return (
                <Link 
                  key={product._id} 
                  to={`/products/${product._id}`} 
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-[#E9E7F5] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-48 sm:h-56 bg-[#F8F7FC] overflow-hidden">
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
                      
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-md">
                          -{discount}%
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                          inWish
                            ? 'bg-[#6C4EFF] text-white'
                            : 'bg-white text-[#6B7280] hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                      </button>

                      {/* Stock Badge */}
                      {product.stock === 0 && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-gray-900/80 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#1E1E2F] line-clamp-2 mb-2 group-hover:text-[#6C4EFF] transition-colors">
                          {product.title}
                        </h3>
                        
                        {/* Rating */}
                        {product.averageRating && (
                          <div className="flex items-center space-x-1 mb-3">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-semibold text-[#1E1E2F]">
                              {product.averageRating.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-[#6B7280]">
                              ({product.totalReviews || 0})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-baseline space-x-2 pt-3 border-t border-[#E9E7F5]">
                        <span className="text-lg font-extrabold text-[#6C4EFF]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.comparePrice > product.price && (
                          <span className="text-xs text-[#6B7280] line-through font-medium">
                            ₹{product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-[#E9E7F5] shadow-sm">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-[#1E1E2F] mb-2">No products found</h3>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              {searchTerm 
                ? `No products matching "${searchTerm}"`
                : 'This store doesn\'t have any products yet.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  loadStoreData();
                }}
                className="mt-4 px-6 py-2.5 bg-[#6C4EFF] text-white text-sm font-bold rounded-xl hover:bg-[#5A3FE0] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};