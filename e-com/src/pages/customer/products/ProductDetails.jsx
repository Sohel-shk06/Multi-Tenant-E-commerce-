import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { 
  ArrowLeft, ShoppingBag, Star, Store, Check, Heart, 
  ChevronLeft, ChevronRight, Minus, Plus, Share2, 
  Truck, Shield, RotateCcw, Package, Tag
} from 'lucide-react';

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(productId);
        setProduct(data);
        setSelectedImage(0);
        setQuantity(1);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const isInWishlist = wishlist.some(item => item.productId === product?._id);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0]?.url || '',
      store: product.store,
      stock: product.stock
    };
    dispatch(addToCart(cartItem));
    alert(`✅ Added ${quantity} x ${product.title} to cart!`);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0]?.url || '',
      store: product.store,
      stock: product.stock
    };
    dispatch(addToCart(cartItem));
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || '',
    }));
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4DF6] mx-auto mb-4"></div>
          <p className="text-sm text-[#6B7280] font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E9E7F5] max-w-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E2F] mb-2">Product not found</h2>
          <p className="text-sm text-[#6B7280] mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center space-x-1.5 sm:space-x-2 text-[#6B7280] hover:text-[#6C4DF6] transition-colors group"
          >
            <div className="p-1.5 sm:p-2 bg-white border border-[#E9E7F5] rounded-lg group-hover:border-[#6C4DF6] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Back</span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-2 text-xs text-[#6B7280]">
            <Link to="/" className="hover:text-[#6C4DF6] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#6C4DF6] transition-colors">Products</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/products?category=${product.category._id}`} className="hover:text-[#6C4DF6] transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
          </nav>

          <button 
            onClick={handleToggleWishlist}
            className={`p-2 rounded-lg border transition-all ${
              isInWishlist 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-white border-[#E9E7F5] text-[#6B7280] hover:border-[#6C4DF6] hover:text-[#6C4DF6]'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left: Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#E9E7F5] overflow-hidden shadow-sm">
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                  -{discount}% OFF
                </div>
              )}

              {/* Stock Badge */}
              {product.stock === 0 && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gray-900/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                  Out of Stock
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E1E2F]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E1E2F]" />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="aspect-square flex items-center justify-center p-4 sm:p-8">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[selectedImage]?.url} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain transition-opacity duration-300" 
                  />
                ) : (
                  <div className="text-center">
                    <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-[#6B7280]">No Image Available</p>
                  </div>
                )}
              </div>

              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden transition-all ${
                      selectedImage === idx 
                        ? 'border-[#6C4DF6] shadow-md scale-105' 
                        : 'border-[#E9E7F5] hover:border-[#6C4DF6]/50'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Features Grid - Mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:hidden">
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-3 text-center">
                <Truck className="w-5 h-5 text-[#6C4DF6] mx-auto mb-1" />
                <p className="text-[10px] sm:text-xs font-semibold text-[#1E1E2F]">Free Delivery</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-3 text-center">
                <Shield className="w-5 h-5 text-[#6C4DF6] mx-auto mb-1" />
                <p className="text-[10px] sm:text-xs font-semibold text-[#1E1E2F]">Secure Pay</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-3 text-center">
                <RotateCcw className="w-5 h-5 text-[#6C4DF6] mx-auto mb-1" />
                <p className="text-[10px] sm:text-xs font-semibold text-[#1E1E2F]">Easy Return</p>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E9E7F5] p-4 sm:p-6 lg:p-8 shadow-sm">
              {/* Category & Store */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.category && (
                  <Link 
                    to={`/products?category=${product.category._id}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#EEE9FF] text-[#6C4DF6] text-xs font-bold rounded-full hover:bg-[#6C4DF6] hover:text-white transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{product.category.name}</span>
                  </Link>
                )}
                {product.store && (
                  <Link 
                    to={`/stores/${product.store._id}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#F8F7FC] text-[#6B7280] text-xs font-bold rounded-full hover:bg-[#6C4DF6] hover:text-white transition-colors"
                  >
                    <Store className="w-3 h-3" />
                    <span>{product.store.name}</span>
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1E1E2F] mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-0.5 px-2 py-1 bg-green-50 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-green-700">
                      {product.averageRating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">
                    ({product.totalReviews || 120} reviews)
                  </span>
                </div>
                <span className="text-[#E9E7F5]">|</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  product.stock > 0 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4 pb-4 border-b border-[#E9E7F5]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#6C4DF6]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.comparePrice > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-[#6B7280] line-through font-medium">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      Save ₹{(product.comparePrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description - Mobile Only */}
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4 lg:hidden">
                {product.description?.substring(0, 150)}...
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold text-[#1E1E2F] uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-[#E9E7F5] rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 sm:p-2.5 text-[#6B7280] hover:bg-[#F8F7FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 sm:px-5 py-2 font-bold text-[#1E1E2F] border-x border-[#E9E7F5] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 sm:p-2.5 text-[#6B7280] hover:bg-[#F8F7FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className="hidden lg:flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-white border-2 border-[#6C4DF6] text-[#6C4DF6] py-3 px-6 rounded-xl font-bold hover:bg-[#6C4DF6] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-[#6C4DF6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Features Grid - Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-4 flex items-center space-x-3">
                <div className="p-2 bg-[#EEE9FF] rounded-lg">
                  <Truck className="w-5 h-5 text-[#6C4DF6]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E2F]">Free Delivery</p>
                  <p className="text-[10px] text-[#6B7280]">On orders ₹499+</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-4 flex items-center space-x-3">
                <div className="p-2 bg-[#EEE9FF] rounded-lg">
                  <Shield className="w-5 h-5 text-[#6C4DF6]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E2F]">Secure Pay</p>
                  <p className="text-[10px] text-[#6B7280]">100% protected</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E9E7F5] p-4 flex items-center space-x-3">
                <div className="p-2 bg-[#EEE9FF] rounded-lg">
                  <RotateCcw className="w-5 h-5 text-[#6C4DF6]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E2F]">Easy Return</p>
                  <p className="text-[10px] text-[#6B7280]">7 days policy</p>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E9E7F5] shadow-sm overflow-hidden">
              <div className="flex border-b border-[#E9E7F5]">
                {['description', 'reviews', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                      activeTab === tab 
                        ? 'text-[#6C4DF6]' 
                        : 'text-[#6B7280] hover:text-[#1E1E2F]'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C4DF6]"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'description' && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                      {product.description || 'No description available for this product.'}
                    </p>
                    
                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-[#E9E7F5]">
                        <p className="text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-3">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-[#F8F7FC] text-[#6B7280] px-3 py-1.5 rounded-full font-medium hover:bg-[#EEE9FF] hover:text-[#6C4DF6] transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-[#1E1E2F] mb-1">
                      {product.averageRating?.toFixed(1) || '4.5'} / 5
                    </p>
                    <p className="text-sm text-[#6B7280] mb-4">
                      Based on {product.totalReviews || 120} reviews
                    </p>
                    <button className="px-6 py-2.5 bg-[#6C4DF6] text-white text-sm font-bold rounded-xl hover:bg-[#5A3FE0] transition-colors">
                      Write a Review
                    </button>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-[#6C4DF6] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1E1E2F]">Free Delivery</p>
                        <p className="text-xs text-[#6B7280]">On orders above ₹499</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="w-5 h-5 text-[#6C4DF6] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1E1E2F]">7 Days Return</p>
                        <p className="text-xs text-[#6B7280]">Easy return policy</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-[#6C4DF6] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1E1E2F]">100% Original</p>
                        <p className="text-xs text-[#6B7280]">Genuine products guaranteed</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E7F5] lg:hidden z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
  <div className="max-w-7xl mx-auto px-3 py-3 flex items-center gap-2">
    <button 
      onClick={handleToggleWishlist}
      className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
        isInWishlist 
          ? 'bg-red-50 border-red-200 text-red-500' 
          : 'border-[#E9E7F5] text-[#6B7280]'
      }`}
      aria-label="Wishlist"
    >
      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>

    <button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className="flex-1 bg-white border-2 border-[#6C4DF6] text-[#6C4DF6] py-3 px-3 rounded-xl font-bold text-sm hover:bg-[#6C4DF6] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
    >
      <ShoppingBag className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">Add to Cart</span>
    </button>
    
    <button
      onClick={handleBuyNow}
      disabled={product.stock === 0}
      className="flex-1 bg-gradient-to-r from-[#6C4DF6] to-[#9C7CFF] text-white py-3 px-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
    >
      <Check className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">Buy Now</span>
    </button>
  </div>
</div>
    </div>
  );
};