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
        // Fetch newest products from backend (sorted by createdAt desc by default)
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
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-6 overflow-x-hidden py-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 h-80 w-[280px] shrink-0"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't render if empty
  }

  return (
    <section className="py-12 bg-gray-50/50">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Check out our latest products just added to the catalog.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1 transition-colors"
          >
            <span>View All New Additions</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-15 bg-white hover:bg-blue-600 hover:text-white text-gray-700 shadow-xl border border-gray-150 rounded-full p-3 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Container */}
          <div
            ref={containerRef}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const isInWish = wishlist.some((item) => item.productId === product._id);
              return (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[280px] snap-always"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* Image & Badges */}
                      <div className="relative h-56 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {/* ✨ New Badge */}
                        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                           New
                        </span>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-colors ${
                            isInWish
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-300">
                            <Package className="w-12 h-12 mb-2" />
                            <span className="text-xs">No Image</span>
                          </div>
                        )}

                        {/* Quick Add Slide-up Button */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-center">
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            disabled={product.stock === 0}
                            className="w-full bg-white hover:bg-blue-600 hover:text-white text-gray-900 font-bold py-2 px-4 rounded-xl shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>{product.stock === 0 ? 'Out of Stock' : 'Quick Add'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                          {product.store?.name || 'Official Partner'}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center mt-2 space-x-1 text-yellow-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-semibold text-gray-700">
                            {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({product.totalReviews || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-extrabold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.comparePrice > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{product.comparePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.comparePrice > product.price && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
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

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-15 bg-white hover:bg-blue-600 hover:text-white text-gray-700 shadow-xl border border-gray-150 rounded-full p-3 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
