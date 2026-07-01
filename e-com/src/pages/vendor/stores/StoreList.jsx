import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchVendorStoresFull,
  deleteVendorStore,
} from "../../../app/store/vendorStoreSlice";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Store as StoreIcon,
  RefreshCw,
} from "lucide-react";

export const StoreList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stores, isLoading, currentPage, totalPages, totalStores, error } =
    useSelector((state) => state.vendorStores);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchVendorStoresFull({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = (storeId, storeName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${storeName}"? This action cannot be undone.`,
      )
    ) {
      dispatch(deleteVendorStore(storeId));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchVendorStoresFull({ page: 1, search: searchTerm }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Stores</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalStores} store{totalStores !== 1 ? "s" : ""} registered
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <Link
            to="/vendor/stores/create"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Store</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p className="font-medium">Error</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Stores Grid */}
      {isLoading && stores.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-gray-300 transition-all duration-300 overflow-hidden max-w-[400px]"
            >
              {/* Store Banner */}
              {store.banner ? (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={store.banner}
                    alt={`${store.name} banner`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  {/* Status Badge */}
                  <div className="absolute top-0 right-0 m-4 z-10">{getStatusBadge(store.status)}</div>
                    
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-green-500 to-teal-500"></div>
              )}

              {/* Store Header */}
              <div className="p-6 pt-18 border-b-2 border-gray-200">
                <div className="flex items-start justify-between -mt-12">
                  {/* Left Side */}
                  <div className="flex items-center gap-8">
                    {/* Store Logo */}
                    {store.logo ? (
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-16 h-16 rounded-xl object-cover border-[5px] border-white shadow-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Logo Fallback */}
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl border-[5px] border-white shadow-lg flex-shrink-0"
                      style={{ display: store.logo ? "none" : "flex" }}
                    >
                      {store.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name & Slug */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {store.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        /{store.slug}
                      </p>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Store Info */}
              <div className="p-6 space-y-4">
                {store.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {store.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Currency</p>
                    <p className="font-semibold text-gray-900">
                      {store.settings?.currency || "INR"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {store.settings?.contactEmail && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Contact Email</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {store.settings.contactEmail}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t-2 border-gray-200 flex space-x-2">
                <button
                  onClick={() => navigate(`/vendor/stores/edit/${store._id}`)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all font-medium"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(store._id, store.name)}
                  className="flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 rounded-xl border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No stores yet</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Create your first store to start selling products.
          </p>
          <Link
            to="/vendor/stores/create"
            className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Store</span>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                dispatch(
                  fetchVendorStoresFull({
                    page: currentPage - 1,
                    search: searchTerm,
                  }),
                )
              }
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                dispatch(
                  fetchVendorStoresFull({
                    page: currentPage + 1,
                    search: searchTerm,
                  }),
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
