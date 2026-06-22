import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores, deleteStore } from '../../app/store/storeSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { 
  Search, Plus, Trash2, Edit, Store as StoreIcon, 
  Eye, BarChart3, Settings 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const StoreList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stores, isLoading, error, currentPage, totalPages } = useSelector((state) => state.stores);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStores({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = (storeId, storeName) => {
    if (window.confirm(`Are you sure you want to delete "${storeName}"? This action cannot be undone.`)) {
      dispatch(deleteStore(storeId));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (isLoading && stores.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vendor storefronts and configurations.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/stores/create')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search stores by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store Name</th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                )}
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.length > 0 ? (
                stores.map((store) => (
                  <tr key={store._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <StoreIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          {/* ✅ Store name clickable - StoreDetails par le jayega */}
                          <button
                            onClick={() => navigate(`/admin/stores/${store._id}`)}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left"
                          >
                            {store.name}
                          </button>
                          <p className="text-xs text-gray-500">{store.settings?.currency || 'INR'}</p>
                        </div>
                      </div>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 text-sm text-gray-600">{store.vendor?.name || 'N/A'}</td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{store.slug}</td>
                    <td className="px-6 py-4">{getStatusBadge(store.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* ✅ NEW: View Details Button */}
                        <button
                          onClick={() => navigate(`/admin/stores/${store._id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* ✅ NEW: Analytics Button */}
                        <button
                          onClick={() => navigate(`/admin/stores/${store._id}/analytics`)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        
                        {/* ✅ NEW: Settings Button */}
                        <button
                          onClick={() => navigate(`/admin/stores/${store._id}/settings`)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        
                        {/* ✅ Edit Button */}
                        <button
                          onClick={() => navigate(`/admin/stores/edit/${store._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {/* ✅ Delete Button */}
                        <button
                          onClick={() => handleDelete(store._id, store.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                    No stores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => dispatch(fetchStores({ page: currentPage - 1, search: searchTerm }))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchStores({ page: currentPage + 1, search: searchTerm }))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};