import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, updateVendorStatus } from '../../app/store/vendorSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const VendorList = ({ defaultStatus = '' }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { vendors, isLoading, error, currentPage, totalPages } = useSelector((state) => state.vendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(defaultStatus);

  // Jab route change ho, toh status filter update karein
  useEffect(() => {
    setStatusFilter(defaultStatus);
  }, [defaultStatus, location.pathname]);

  useEffect(() => {
    dispatch(fetchVendors({ 
      page: currentPage, 
      search: searchTerm,
      status: statusFilter // ✅ Status filter pass karein
    }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleStatusChange = (vendorId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus} this vendor?`)) {
      dispatch(updateVendorStatus({ vendorId, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Suspended</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  // Page title dynamically set karein
  const getPageTitle = () => {
    if (statusFilter === 'pending') return 'Pending Vendor Approvals';
    if (statusFilter === 'suspended') return 'Suspended Vendors';
    return 'All Vendors';
  };

  if (isLoading && vendors.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {statusFilter === 'pending' && 'Review and approve pending vendor applications.'}
            {statusFilter === 'suspended' && 'Manage suspended vendor accounts.'}
            {!statusFilter && 'Manage and monitor all platform vendors.'}
          </p>
        </div>
        {!statusFilter && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + Add New Vendor
          </button>
        )}
      </div>

      {/* Status Filter Tabs (sirf main vendors page par dikhayein) */}
      {!defaultStatus && (
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              !statusFilter 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Vendors
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === 'pending' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === 'suspended' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Suspended
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Vendors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vendor.email}</td>
                    <td className="px-6 py-4">{getStatusBadge(vendor.status || 'pending')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleStatusChange(vendor._id, vendor.status)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                          vendor.status === 'active' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {vendor.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No vendors found.
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
                onClick={() => dispatch(fetchVendors({ page: currentPage - 1, search: searchTerm, status: statusFilter }))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchVendors({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
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