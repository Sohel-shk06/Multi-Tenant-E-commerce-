import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchStore } from '../../app/store/storeSlice';
import { ArrowLeft, Store as StoreIcon, Package, ShoppingCart, DollarSign, Users, Edit, BarChart3, Settings } from 'lucide-react';

export const StoreDetails = () => {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStore: store, isLoading } = useSelector((state) => state.stores);

  useEffect(() => {
    dispatch(fetchStore(storeId));
  }, [dispatch, storeId]);

  if (isLoading || !store) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin/stores')} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Stores</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <StoreIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <p className="text-sm text-gray-500 mt-1">/{store.slug}</p>
              <div className="flex items-center space-x-3 mt-2">
                {getStatusBadge(store.status)}
                <span className="text-sm text-gray-500">
                  Created {new Date(store.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/admin/stores/${store._id}/analytics`}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm font-medium flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link
              to={`/admin/stores/${store._id}/settings`}
              className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link
              to={`/admin/stores/edit/${store._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Products</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{store.productCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{store.orderCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{(store.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Customers</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{store.customerCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Info */}
        {store.vendor && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Vendor Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {store.vendor.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <Link 
                    to={`/admin/vendors/${store.vendor._id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {store.vendor.name}
                  </Link>
                  <p className="text-sm text-gray-500">{store.vendor.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Store Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Store Settings</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium">{store.settings?.currency || 'INR'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact Email</span>
              <span className="font-medium">{store.settings?.contactEmail || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact Phone</span>
              <span className="font-medium">{store.settings?.contactPhone || 'Not set'}</span>
            </div>
            {store.description && (
              <div className="pt-3 border-t">
                <p className="text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{store.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};