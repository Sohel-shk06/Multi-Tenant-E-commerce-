import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, updateProductStatus } from '../../app/store/productSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Plus, Trash2, Edit, Eye, EyeOff, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading, error, currentPage, totalPages } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = { page: currentPage };
    if (searchTerm && searchTerm.trim() !== '') {
      params.search = searchTerm.trim();
    }
    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleStatusToggle = (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch(updateProductStatus({ productId, status: newStatus }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      active:   { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      inactive: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
      draft:    { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
    };
    const s = styles[status] || styles.inactive;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="text-[12px] font-medium text-red-600">Out of stock</span>;
    if (stock < 10) return <span className="text-[12px] font-medium text-yellow-600">{stock} left</span>;
    return <span className="text-[12px] text-gray-600">{stock}</span>;
  };

  if (isLoading && products.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Product Management</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Manage your product catalog and inventory.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/create')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#4338CA' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4338CA'}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
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
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#EEF2FF' }}
                          >
                            <Package className="w-4 h-4" style={{ color: '#4338CA' }} />
                          </div>
                        )}
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{product.title}</p>
                          <p className="text-[11px] text-gray-400">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {product.category?.name ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
                          style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
                        >
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-[13px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                      {product.comparePrice > product.price && (
                        <p className="text-[11px] text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStockBadge(product.stock)}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusToggle(product._id, product.status)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-indigo-50 transition-colors"
                          style={{ color: '#4338CA' }}
                          title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {product.status === 'active'
                            ? <EyeOff className="w-3.5 h-3.5" />
                            : <Eye className="w-3.5 h-3.5" />
                          }
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-green-50 transition-colors"
                          style={{ color: '#15803D' }}
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 transition-colors"
                          style={{ color: '#DC2626' }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-dashed border-gray-200"
                      style={{ backgroundColor: '#EEF2FF' }}
                    >
                      <Package className="w-5 h-5" style={{ color: '#818CF8' }} />
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">No products found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchProducts({ page: currentPage - 1, search: searchTerm }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchProducts({ page: currentPage + 1, search: searchTerm }))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};