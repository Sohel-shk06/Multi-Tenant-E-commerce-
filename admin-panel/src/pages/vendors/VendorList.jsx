import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, updateVendorStatus } from '../../app/store/vendorSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, CheckCircle, XCircle, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const VendorList = ({ defaultStatus = '' }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { vendors, isLoading, error, currentPage, totalPages } = useSelector((state) => state.vendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(defaultStatus);

  useEffect(() => {
    setStatusFilter(defaultStatus);
  }, [defaultStatus, location.pathname]);

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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors"
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
                onClick={() => setStatusFilter(tab.value)}
                className="px-3 py-1.5 text-[12px] font-medium rounded-md transition-all"
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
                        className="text-[12px] font-medium px-3 py-1.5 rounded-md border transition-colors"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchVendors({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
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