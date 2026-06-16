import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsForModeration, moderateProduct } from '../../app/store/productSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, CheckCircle, XCircle, Eye, Package, Calendar, User } from 'lucide-react';

export const ProductModeration = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error, currentPage, totalPages, totalProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsForModeration({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleApprove = (productId) => {
    if (window.confirm('Are you sure you want to approve this product? It will be visible to customers.')) {
      dispatch(moderateProduct({ productId, action: 'approve' }));
    }
  };

  const handleRejectClick = (product) => {
    setSelectedProduct(product);
    setRejectNotes('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (selectedProduct) {
      dispatch(moderateProduct({ 
        productId: selectedProduct._id, 
        action: 'reject',
        notes: rejectNotes 
      }));
      setShowRejectModal(false);
      setSelectedProduct(null);
    }
  };

  if (isLoading && products.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Moderation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve products submitted by vendors. 
            {totalProducts > 0 && <span className="ml-2 font-semibold text-orange-600">{totalProducts} pending</span>}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Vendors submit products as drafts. Review each product's details, images, and pricing. 
              Approve to make it live, or reject with feedback for the vendor.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Products Grid (Card View for better review) */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>

                {/* Price & Category */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {product.category?.name || 'No Category'}
                  </span>
                </div>

                {/* Vendor Info */}
                <div className="flex items-center text-xs text-gray-600 border-t pt-3">
                  <User className="w-3 h-3 mr-1" />
                  <span className="font-medium">{product.vendor?.name || 'Unknown'}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Stock & SKU */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Stock: <strong className="text-gray-700">{product.stock}</strong></span>
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectClick(product)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
          <p className="text-sm text-gray-500 mt-2">No products pending moderation. Check back later.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => dispatch(fetchProductsForModeration({ page: currentPage - 1, search: searchTerm }))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => dispatch(fetchProductsForModeration({ page: currentPage + 1, search: searchTerm }))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Product</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide feedback for the vendor on why this product is being rejected.
            </p>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{selectedProduct.title}</p>
              <p className="text-xs text-gray-500 mt-1">by {selectedProduct.vendor?.name}</p>
            </div>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Product images are unclear, pricing seems incorrect, description needs improvement..."
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};