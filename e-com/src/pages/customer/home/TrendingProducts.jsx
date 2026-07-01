// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { productService } from '../../../services/product.service';
// import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
// import { Star, ShoppingBag, Heart, Package } from 'lucide-react';

// export const TrendingProducts = () => {
//   const dispatch = useDispatch();
//   const { wishlist } = useSelector((state) => state.cart);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrending = async () => {
//       try {
//         // Fetch products from API
//         const data = await productService.getProducts({ limit: 20 });
//         const allProducts = data.products || [];

//         // Sort by average rating and total reviews to get trending items
//         const trending = [...allProducts]
//           .sort((a, b) => {
//             const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
//             if (ratingDiff !== 0) return ratingDiff;
//             return (b.totalReviews || 0) - (a.totalReviews || 0);
//           })
//           .slice(0, 8); // Top 8 trending products

//         setProducts(trending);
//       } catch (error) {
//         console.error('Error fetching trending products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrending();
//   }, []);

//   const handleQuickAdd = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (product.stock === 0) {
//       alert('This product is out of stock.');
//       return;
//     }

//     const cartItem = {
//       productId: product._id,
//       title: product.title,
//       price: product.price,
//       quantity: 1,
//       image: product.images?.[0]?.url || '',
//       store: product.store,
//       stock: product.stock
//     };

//     dispatch(addToCart(cartItem));
//     alert(`Added "${product.title}" to cart!`);
//   };

//   const handleWishlistToggle = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     dispatch(toggleWishlist({
//       productId: product._id,
//       title: product.title,
//       price: product.price,
//       image: product.images?.[0]?.url || '',
//     }));
//   };

//   // 3D Mouse movement tilt handlers
//   const handleMouseMove = (e) => {
//     const card = e.currentTarget;
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
    
//     // Smooth 3D tilt calculation
//     const rotateX = ((centerY - y) / centerY) * 12; // tilt up/down
//     const rotateY = ((x - centerX) / centerX) * 12; // tilt left/right
    
//     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
//   };

//   const handleMouseLeave = (e) => {
//     const card = e.currentTarget;
//     card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white rounded-2xl border border-gray-100 h-80"></div>
//         ))}
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return null; // Don't render if there are no trending products
//   }

//   return (
//     <section className="py-12 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//               Trending Products
//             </h2>
//             <p className="mt-2 text-sm text-gray-500">
//               Discover what's hot right now based on ratings and popular reviews.
//             </p>
//           </div>
//           <Link
//             to="/products"
//             className="mt-4 md:mt-0 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1 transition-colors"
//           >
//             <span>Explore All Products</span>
//             <span>&rarr;</span>
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {products.map((product) => {
//             const isInWish = wishlist.some((item) => item.productId === product._id);
//             return (
//               <Link
//                 key={product._id}
//                 to={`/products/${product._id}`}
//                 className="group block"
//               >
//                 <div
//                   onMouseMove={handleMouseMove}
//                   onMouseLeave={handleMouseLeave}
//                   className="bg-white rounded-[22px] border border-[#E9E7F5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 ease-out"
//                   style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
//                 >
//                   {/* Image & Badge Container */}
//                   <div className="relative h-64 bg-[#F8F7FC] overflow-hidden flex items-center justify-center">
//                     {/* 🔥 Trending Badge */}
//                     <span className="absolute top-3.5 left-3.5 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
//                        Trending
//                     </span>

//                     {/* Wishlist Button */}
//                     <button
//                       onClick={(e) => handleWishlistToggle(e, product)}
//                       className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-115 ${
//                         isInWish
//                           ? 'bg-[#6C4DF6] text-white'
//                           : 'bg-white text-[#6B7280] hover:text-red-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       <Heart className={`w-4 h-4 ${isInWish ? 'fill-current' : ''}`} />
//                     </button>

//                     {product.images && product.images.length > 0 ? (
//                       <img
//                         src={product.images[0].url}
//                         alt={product.title}
//                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       />
//                     ) : (
//                       <div className="flex flex-col items-center text-gray-300">
//                         <Package className="w-16 h-16 mb-2" />
//                         <span className="text-xs">No Image</span>
//                       </div>
//                     )}

//                     {/* Quick Add Slide-up Button */}
//                     <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-center">
//                       <button
//                         onClick={(e) => handleQuickAdd(e, product)}
//                         disabled={product.stock === 0}
//                         className="w-full bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white hover:shadow-glow font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <ShoppingBag className="w-4 h-4" />
//                         <span>{product.stock === 0 ? 'Out of Stock' : 'Quick Add'}</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Details Section */}
//                   <div className="p-5">
//                     <span className="text-[10px] font-extrabold text-[#6C4DF6] tracking-widest uppercase">
//                       {product.store?.name || 'Official Partner'}
//                     </span>
//                     <h3 className="mt-1.5 text-base font-bold text-[#1E1E2F] line-clamp-1 group-hover:text-[#6C4DF6] transition-colors">
//                       {product.title}
//                     </h3>
                    
//                     {/* Rating */}
//                     <div className="flex items-center mt-2.5 space-x-1 text-yellow-400">
//                       <Star className="w-4 h-4 fill-current" />
//                       <span className="text-sm font-semibold text-gray-700">
//                         {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
//                       </span>
//                       <span className="text-xs text-[#6B7280]">
//                         ({product.totalReviews || 0})
//                       </span>
//                     </div>

//                     {/* Price */}
//                     <div className="flex items-baseline justify-between mt-4">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-lg font-extrabold text-[#6C4DF6]">
//                           ₹{product.price.toLocaleString()}
//                         </span>
//                         {product.comparePrice > product.price && (
//                           <span className="text-sm text-[#6B7280] line-through">
//                             ₹{product.comparePrice.toLocaleString()}
//                           </span>
//                         )}
//                       </div>
//                       {product.comparePrice > product.price && (
//                         <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
//                           {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };






import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { Star, ShoppingBag, Heart, Package } from 'lucide-react';

export const TrendingProducts = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await productService.getProducts({ limit: 20 });
        const allProducts = data.products || [];

        const trending = [...allProducts]
          .sort((a, b) => {
            const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return (b.totalReviews || 0) - (a.totalReviews || 0);
          })
          .slice(0, 8);

        setProducts(trending);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
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
    alert(`Added "${product.title}" to cart!`);
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

  // 3D Mouse movement tilt handlers - Desktop only
  const handleMouseMove = (e) => {
    // Disable 3D effect on mobile/touch devices
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="h-6 sm:h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] border border-gray-100 overflow-hidden">
                <div className="h-40 sm:h-56 lg:h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Trending Products
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
              Discover what's hot right now based on ratings and popular reviews.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm flex items-center space-x-1 transition-colors"
          >
            <span>Explore All Products</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => {
            const isInWish = wishlist.some((item) => item.productId === product._id);
            return (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group block"
              >
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="bg-white rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] border border-[#E9E7F5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 ease-out"
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                  {/* Image & Badge Container - Responsive Height */}
                  <div className="relative h-40 sm:h-52 lg:h-64 bg-[#F8F7FC] overflow-hidden flex items-center justify-center">
                    {/* Trending Badge - Responsive */}
                    <span className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                       Trending
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
                        <Package className="w-10 h-10 sm:w-16 sm:h-16 mb-1 sm:mb-2" />
                        <span className="text-[10px] sm:text-xs">No Image</span>
                      </div>
                    )}

                    {/* Quick Add Slide-up Button - Responsive */}
                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-center">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white hover:shadow-glow font-bold py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{product.stock === 0 ? 'Out of Stock' : 'Quick Add'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Details Section - Responsive */}
                  <div className="p-3 sm:p-4 lg:p-5">
                    <span className="text-[8px] sm:text-[10px] font-extrabold text-[#6C4DF6] tracking-widest uppercase">
                      {product.store?.name || 'Official Partner'}
                    </span>
                    <h3 className="mt-0.5 sm:mt-1 lg:mt-1.5 text-xs sm:text-sm lg:text-base font-bold text-[#1E1E2F] line-clamp-1 group-hover:text-[#6C4DF6] transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* Rating - Responsive */}
                    <div className="flex items-center mt-1 sm:mt-2 lg:mt-2.5 space-x-1 text-yellow-400">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      <span className="text-[10px] sm:text-sm font-semibold text-gray-700">
                        {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-[8px] sm:text-xs text-[#6B7280]">
                        ({product.totalReviews || 0})
                      </span>
                    </div>

                    {/* Price - Responsive */}
                    <div className="flex items-baseline justify-between mt-2 sm:mt-3 lg:mt-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm sm:text-base lg:text-lg font-extrabold text-[#6C4DF6]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.comparePrice > product.price && (
                          <span className="text-[10px] sm:text-sm text-[#6B7280] line-through">
                            ₹{product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.comparePrice > product.price && (
                        <span className="text-[8px] sm:text-[10px] font-extrabold text-green-600 bg-green-50 px-1 sm:px-2 py-0.5 rounded-lg">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};