import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../../../app/store/cartSlice';
import { Heart, ShoppingBag, Trash2, Package } from 'lucide-react';

export const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);

  const handleRemoveFromWishlist = (productId) => {
    // Toggle se remove ho jayega kyunki already wishlist mein hai
    dispatch(toggleWishlist({ productId }));
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save products you love to buy them later.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            <span>Start Shopping</span>
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-1">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.productId} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <Link to={`/products/${item.productId}`} className="block">
                <div className="relative h-56 bg-gray-100">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Wishlist Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link to={`/products/${item.productId}`}>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Link
                  to={`/products/${item.productId}`}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Product</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Clear All Button */}
        {wishlist.length > 1 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your wishlist?')) {
                  wishlist.forEach(item => dispatch(toggleWishlist({ productId: item.productId })));
                }
              }}
              className="px-6 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-colors"
            >
              Clear All Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};