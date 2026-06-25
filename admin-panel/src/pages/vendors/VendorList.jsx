import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, updateVendorStatus, createVendor } from '../../app/store/vendorSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { 
  Search, CheckCircle, XCircle, Clock, Plus, ChevronLeft, ChevronRight, 
  X, Eye, EyeOff, User, Mail, Lock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VendorList = ({ defaultStatus = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendors, isLoading, error, currentPage, totalPages } = useSelector((state) => state.vendors);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use activeTab for switching when defaultStatus is not fixed (i.e. 'All Vendors' page)
  const [activeTab, setActiveTab] = useState('');
  const statusFilter = defaultStatus || activeTab;

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalFormData, setModalFormData] = useState({ name: '', email: '', password: '' });
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchVendors({ page: currentPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleStatusChange = (e, vendorId, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus} this vendor?`)) {
      dispatch(updateVendorStatus({ vendorId, status: newStatus }));
    }
  };

  const handleAddVendorSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    if (!modalFormData.name || !modalFormData.email || !modalFormData.password) {
      setModalError('All fields are required');
      setModalLoading(false);
      return;
    }

    try {
      const resultAction = await dispatch(createVendor(modalFormData));
      if (createVendor.fulfilled.match(resultAction)) {
        // Success
        setShowAddModal(false);
        setModalFormData({ name: '', email: '', password: '' });
      } else {
        // Error
        setModalError(resultAction.payload || 'Failed to create vendor');
      }
    } catch {
      setModalError('An unexpected error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-green-50 text-green-700 border border-green-100">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">
            <XCircle className="w-3 h-3" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getPageTitle = () => {
    if (statusFilter === 'pending') return 'Pending Approvals';
    if (statusFilter === 'suspended') return 'Suspended Vendors';
    return 'All Vendors';
  };

  const tabs = [
    { label: 'All Vendors', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' },
  ];

  if (isLoading && vendors.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {statusFilter === 'pending' && 'Review and approve pending vendor applications.'}
            {statusFilter === 'suspended' && 'Manage suspended vendor accounts.'}
            {!statusFilter && 'Manage and monitor all platform vendors.'}
          </p>
        </div>
        {!statusFilter && (
          <button
            onClick={() => {
              setModalError('');
              setModalFormData({ name: '', email: '', password: '' });
              setShowPassword(false);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#4338CA' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4338CA'}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vendor
          </button>
        )}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {!defaultStatus && (
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="px-3 py-1.5 text-[12px] font-medium rounded-md transition-all cursor-pointer"
                style={
                  statusFilter === tab.value
                    ? { backgroundColor: '#4338CA', color: '#fff' }
                    : { color: '#6b7280' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
          />
        </div>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                          style={{ backgroundColor: '#4338CA' }}
                        >
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-medium text-gray-900">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{vendor.email}</td>
                    <td className="px-5 py-3.5">{getStatusBadge(vendor.status || 'pending')}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(vendor.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => handleStatusChange(e, vendor._id, vendor.status)}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-md border transition-colors cursor-pointer"
                        style={
                          vendor.status === 'active'
                            ? { color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fff' }
                            : { color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#fff' }
                        }
                      >
                        {vendor.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-[13px] font-medium text-gray-500">No vendors found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchVendors({ page: currentPage - 1, search: searchTerm, status: statusFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchVendors({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full relative z-10 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Add New Vendor</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Register a manual vendor account directly.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddVendorSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                  {modalError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={modalFormData.name}
                    onChange={e => setModalFormData({ ...modalFormData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={modalFormData.email}
                    onChange={e => setModalFormData({ ...modalFormData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={modalFormData.password}
                    onChange={e => setModalFormData({ ...modalFormData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={modalLoading}
                  className="px-4 py-2 text-[12px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 text-[12px] font-semibold text-white rounded-xl transition-all shadow-sm shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: '#4338CA' }}
                  onMouseEnter={e => !modalLoading && (e.currentTarget.style.backgroundColor = '#312E81')}
                  onMouseLeave={e => !modalLoading && (e.currentTarget.style.backgroundColor = '#4338CA')}
                >
                  {modalLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Vendor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};