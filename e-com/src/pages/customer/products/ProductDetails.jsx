import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../../../services/product.service';
import { addToCart, toggleWishlist } from '../../../app/store/cartSlice';
import { ArrowLeft, ShoppingBag, Star, Store, Check, Heart } from 'lucide-react';

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProduct(productId);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  // Check if product is in wishlist
  const isInWishlist = wishlist.some(item => item.productId === product?._id);

  const handleAddToCart = () => {
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0]?.url || '',
      store: product.store,
      stock: product.stock
    };
    dispatch(addToCart(cartItem));
    alert(`✅ Added ${quantity} x ${product.title} to cart!`);
  };

  const handleBuyNow = () => {
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Images */}
            <div className="p-6 lg:p-8 bg-gray-50">
              <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden mb-4 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[selectedImage]?.url} 
                    alt={product.title} 
                    className="w-full h-full object-contain p-4" 
                  />
                ) : (
                  <div className="text-gray-400">No Image Available</div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                        selectedImage === idx ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-6 lg:p-8 flex flex-col">
              <div className="mb-2">
                <Link to={`/products?category=${product.category?._id}`} className="text-sm text-blue-600 hover:underline">
                  {product.category?.name}
                </Link>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">4.5</span>
                  <span className="text-sm text-gray-500">(120 reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.comparePrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
                )}
                {product.comparePrice > product.price && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    Save ₹{(product.comparePrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

              {/* Store Info */}
              {product.store && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl mb-8">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.store.name}</p>
                    <p className="text-xs text-gray-500">Official Store</p>
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="mt-auto space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium text-gray-900 border-x border-gray-300">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full sm:flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    <span>Buy Now</span>
                  </button>

                  <button 
                    onClick={handleToggleWishlist}
                    className={`w-full sm:w-auto p-3 border rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isInWishlist 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                    title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                    <span className="sm:hidden ml-2 text-sm font-semibold">
                      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </span>
                  </button>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};