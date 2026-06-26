import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsForModeration, moderateProduct } from '../../app/store/productSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, CheckCircle, XCircle, Package, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (window.confirm('Approve this product? It will be visible to customers.')) {
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
      dispatch(moderateProduct({ productId: selectedProduct._id, action: 'reject', notes: rejectNotes }));
      setShowRejectModal(false);
      setSelectedProduct(null);
    }
  };

  if (isLoading && products.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Product Moderation</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Review and approve products submitted by vendors.
            {totalProducts > 0 && (
              <span className="ml-2 font-semibold" style={{ color: '#A16207' }}>{totalProducts} pending</span>
            )}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-[12px]"
        style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', color: '#4338CA' }}
      >
        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <p><strong>How it works:</strong> Vendors submit products as drafts. Review each product's details, images, and pricing. Approve to make it live, or reject with feedback.</p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">{error}</div>
      )}

      {/* Cards Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 transition-colors">

              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                {product.images?.length > 0 ? (
                  <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
                    style={{ backgroundColor: '#FEF9C3', color: '#A16207', borderColor: '#FDE047' }}
                  >
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.category?.name && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-md border font-medium"
                      style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
                    >
                      {product.category.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="font-medium text-gray-600">{product.vendor?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(product.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Stock: <strong className="text-gray-700">{product.stock}</strong></span>
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#15803D' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#166534'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#15803D'}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#DC2626' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B91C1C'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#DC2626'}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <CheckCircle className="w-6 h-6" style={{ color: '#15803D' }} />
          </div>
          <p className="text-[14px] font-semibold text-gray-900">All caught up!</p>
          <p className="text-[12px] text-gray-400 mt-1">No products pending moderation.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(fetchProductsForModeration({ page: currentPage - 1, search: searchTerm }))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => dispatch(fetchProductsForModeration({ page: currentPage + 1, search: searchTerm }))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">Reject Product</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Provide feedback for the vendor.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[13px] font-medium text-gray-900">{selectedProduct.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">by {selectedProduct.vendor?.name}</p>
              </div>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="e.g., Product images are unclear, pricing seems incorrect..."
                style={{ resize: 'none' }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRejectConfirm}
                  className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: '#DC2626' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B91C1C'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#DC2626'}
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => { setShowRejectModal(false); setSelectedProduct(null); }}
                  className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};