import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores, deleteStore } from '../../app/store/storeSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import {
  Search, Plus, Trash2, Edit,
  Eye, BarChart3, Settings, ChevronLeft, ChevronRight, Store as StoreIcon
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
    if (window.confirm(`Are you sure you want to delete "${storeName}"?`)) {
      dispatch(deleteStore(storeId));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      paused: { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      closed: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    };
    const s = styles[status] || styles.active;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (isLoading && stores.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Store Management</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Manage vendor storefronts and configurations.</p>
        </div>
        <button
          onClick={() => navigate('/admin/stores/create')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#4338CA' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4338CA'}
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Store
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stores..."
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

      {/* Cards Grid */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 transition-colors"
            >
              {/* Top */}
              <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-100">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#EEF2FF' }}
                >
                  <StoreIcon className="w-5 h-5" style={{ color: '#4338CA' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/admin/stores/${store._id}`)}
                    className="text-[14px] font-medium text-left hover:underline truncate block w-full"
                    style={{ color: '#1E1B4B' }}
                  >
                    {store.name}
                  </button>
                  <p className="text-[11px] font-mono text-gray-400 truncate">{store.slug}</p>
                </div>
                {getStatusBadge(store.status)}
              </div>

              {/* Mid */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                {user?.role === 'admin' && (
                  <>
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: '#4338CA' }}
                    >
                      {store.vendor?.name?.charAt(0).toUpperCase() || 'V'}
                    </div>
                    <span className="text-[12px] text-gray-600 flex-1 truncate">{store.vendor?.name || 'N/A'}</span>
                  </>
                )}
                <span className="text-[11px] text-gray-400 ml-auto">
                  {new Date(store.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              {/* Actions */}
              <div className="px-4 py-2.5 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => navigate(`/admin/stores/${store._id}`)}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-indigo-50 transition-colors"
                  style={{ color: '#4338CA' }}
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/admin/stores/${store._id}/analytics`)}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-purple-50 transition-colors"
                  style={{ color: '#6D28D9' }}
                  title="Analytics"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/admin/stores/${store._id}/settings`)}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-orange-50 transition-colors"
                  style={{ color: '#EA580C' }}
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/admin/stores/edit/${store._id}`)}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-blue-50 transition-colors"
                  style={{ color: '#2563EB' }}
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(store._id, store.name)}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 transition-colors"
                  style={{ color: '#DC2626' }}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border border-dashed border-gray-200"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <StoreIcon className="w-6 h-6" style={{ color: '#818CF8' }} />
          </div>
          <p className="text-[13px] font-medium text-gray-500">No stores found</p>
          <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(fetchStores({ page: currentPage - 1, search: searchTerm }))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => dispatch(fetchStores({ page: currentPage + 1, search: searchTerm }))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};