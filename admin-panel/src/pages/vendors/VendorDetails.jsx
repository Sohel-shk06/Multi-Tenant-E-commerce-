import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVendorById, updateVendorStatus } from '../../app/store/vendorSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail, Calendar, Store, ShoppingCart, DollarSign } from 'lucide-react';

export const VendorDetails = () => {
  const { vendorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedVendor: vendor, isLoading, error } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendorById(vendorId));
  }, [dispatch, vendorId]);

  const handleStatusChange = () => {
    const newStatus = vendor.status === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus} this vendor?`)) {
      dispatch(updateVendorStatus({ vendorId, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium bg-green-50 text-green-700 border border-green-100">
            <CheckCircle className="w-3.5 h-3.5" /> Active
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium bg-red-50 text-red-700 border border-red-100">
            <XCircle className="w-3.5 h-3.5" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-[13px]">
          {error}
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-gray-900">Vendor Details</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Full profile and information</p>
          </div>
        </div>
        <button
          onClick={handleStatusChange}
          className="px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors"
          style={
            vendor.status === 'active'
              ? { color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fff' }
              : { color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#fff' }
          }
        >
          {vendor.status === 'active' ? 'Suspend Vendor' : 'Activate Vendor'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: '#4338CA' }}
          >
            {vendor.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] font-semibold text-gray-900">{vendor.name}</h2>
              {getStatusBadge(vendor.status || 'pending')}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-[13px] text-gray-500">{vendor.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-[12px] text-gray-400">
                Joined {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#EEF2FF' }}>
            <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">Role</p>
            <p className="text-[14px] font-semibold text-gray-900 capitalize">{vendor.role}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#EEF2FF' }}>
            <CheckCircle className="w-4 h-4" style={{ color: '#4338CA' }} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">Verified</p>
            <p className="text-[14px] font-semibold text-gray-900">
              {vendor.isVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#EEF2FF' }}>
            <Calendar className="w-4 h-4" style={{ color: '#4338CA' }} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">Last Updated</p>
            <p className="text-[14px] font-semibold text-gray-900">
              {new Date(vendor.updatedAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate(`/admin/vendors/${vendorId}/orders`)}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <ShoppingCart className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900">View Orders</p>
              <p className="text-[11px] text-gray-400">All vendor orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate(`/admin/vendors/${vendorId}/payments`)}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <DollarSign className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900">View Payments</p>
              <p className="text-[11px] text-gray-400">Payment history</p>
            </div>
          </button>

          <button
            onClick={() => navigate(`/admin/vendors/${vendorId}/stores`)}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#EEF2FF' }}>
              <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900">View Stores</p>
              <p className="text-[11px] text-gray-400">Vendor stores</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};