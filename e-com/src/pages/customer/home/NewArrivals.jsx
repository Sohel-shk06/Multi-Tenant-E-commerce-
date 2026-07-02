

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, Package } from 'lucide-react';

export const NewArrivals = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await productService.getProducts({ limit: 12 });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

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

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-4 sm:space-x-6 overflow-x-hidden py-4 animate-pulse px-4 sm:px-6 lg:px-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 sm:h-80 w-[200px] sm:w-[280px] shrink-0"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gray-50/50">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
              Check out our latest products just added to the catalog.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm flex items-center space-x-1 transition-colors"
          >
            <span>View All New Additions</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="relative group/carousel">
          {/* Left Arrow - Hidden on Mobile */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-8px] sm:left-[-16px] top-1/2 -translate-y-1/2 z-15 bg-white hover:bg-blue-600 hover:text-white text-gray-700 shadow-xl border border-gray-150 rounded-full p-2 sm:p-3 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105 hidden sm:flex items-center justify-center"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Carousel Container */}
          <div
            ref={containerRef}
            className="no-scrollbar flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const isInWish = wishlist.some((item) => item.productId === product._id);
              return (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[200px] sm:w-[240px] lg:w-[280px] snap-always"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] border border-[#E9E7F5] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* Image & Badges */}
                      <div className="relative h-40 sm:h-48 lg:h-56 bg-[#F8F7FC] overflow-hidden flex items-center justify-center">
                        {/* New Badge - Responsive */}
                        <span className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-10 bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white text-[8px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                           New
                        </span>

                        {/* Wishlist Button - Responsive */}
                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className={`absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-10 p-1.5 sm:p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-115 ${
                            isInWish
                              ? 'bg-[#6C4DF6] text-white'
                              : 'bg-white text-[#6B7280] hover:text-red-500 hover:bg-gray-50'
                          }`}
                        >
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWish ? 'fill-current' : ''}`} />
                        </button>

                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-300">
                            <Package className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
                            <span className="text-[10px] sm:text-xs">No Image</span>
                          </div>
                        )}

                        {/* Quick Add Slide-up Button - Responsive */}
                        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-center">
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            disabled={product.stock === 0}
                            className="w-full bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white hover:shadow-glow font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{product.stock === 0 ? 'Out of Stock' : 'Quick Add'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Details - Responsive */}
                      <div className="p-3 sm:p-4">
                        <span className="text-[8px] sm:text-[10px] font-extrabold text-[#6C4DF6] tracking-widest uppercase">
                          {product.store?.name || 'Official Partner'}
                        </span>
                        <h3 className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#1E1E2F] line-clamp-1 group-hover:text-[#6C4DF6] transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating - Responsive */}
                        <div className="flex items-center mt-1 sm:mt-2 space-x-1 text-yellow-400">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                            {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-[8px] sm:text-[10px] text-[#6B7280]">
                            ({product.totalReviews || 0})
                          </span>
                        </div>

                        {/* Price - Responsive */}
                        <div className="flex items-baseline justify-between mt-2 sm:mt-3">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-sm sm:text-base font-extrabold text-[#6C4DF6]">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.comparePrice > product.price && (
                              <span className="text-[10px] sm:text-xs text-[#6B7280] line-through">
                                ₹{product.comparePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.comparePrice > product.price && (
                            <span className="text-[8px] sm:text-[10px] font-extrabold text-green-600 bg-green-50 px-1 sm:px-1.5 py-0.5 rounded-lg">
                              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Arrow - Hidden on Mobile */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-8px] sm:right-[-16px] top-1/2 -translate-y-1/2 z-15 bg-white hover:bg-blue-600 hover:text-white text-gray-700 shadow-xl border border-gray-150 rounded-full p-2 sm:p-3 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105 hidden sm:flex items-center justify-center"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};