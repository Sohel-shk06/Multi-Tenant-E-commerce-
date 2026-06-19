import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DisputeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disputes, isLoading, error, currentPage, totalPages, totalItems, statusCounts } = 
    useSelector((state) => state.disputes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDisputes({ 
      page: currentPage, 
      search: searchTerm,
      status: statusFilter,
      priority: priorityFilter
    }));
  }, [dispatch, currentPage, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      vendor_responded: 'bg-blue-100 text-blue-800',
      resolved_customer: 'bg-green-100 text-green-800',
      resolved_vendor: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    const icons = {
      open: <AlertTriangle className="w-3 h-3" />,
      under_review: <Clock className="w-3 h-3" />,
      vendor_responded: <Clock className="w-3 h-3" />,
      resolved_customer: <CheckCircle className="w-3 h-3" />,
      resolved_vendor: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span>{status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  if (isLoading && disputes.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and resolve customer-vendor disputes.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Open</p>
          <p className="text-2xl font-bold text-red-600">{statusCounts.open}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">{statusCounts.under_review}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Vendor Responded</p>
          <p className="text-2xl font-bold text-blue-600">{statusCounts.vendor_responded}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Resolved (Customer)</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.resolved_customer}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Resolved (Vendor)</p>
          <p className="text-2xl font-bold text-purple-600">{statusCounts.resolved_vendor}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Closed</p>
          <p className="text-2xl font-bold text-gray-600">{statusCounts.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="vendor_responded">Vendor Responded</option>
          <option value="resolved_customer">Resolved (Customer)</option>
          <option value="resolved_vendor">Resolved (Vendor)</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {disputes.length > 0 ? (
                disputes.map((dispute) => (
                  <tr key={dispute._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{dispute.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{dispute.reason?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-900">
                        {dispute.order?.orderNumber || 'N/A'}
                      </span>
                      <p className="text-xs text-gray-500">₹{dispute.order?.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{dispute.customer?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{dispute.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{dispute.vendor?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{dispute.vendor?.email}</p>
                    </td>
                    <td className="px-6 py-4">{getPriorityBadge(dispute.priority)}</td>
                    <td className="px-6 py-4">{getStatusBadge(dispute.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/disputes/${dispute._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No disputes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => dispatch(fetchDisputes({ 
                  page: currentPage - 1, 
                  search: searchTerm, 
                  status: statusFilter,
                  priority: priorityFilter
                }))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchDisputes({ 
                  page: currentPage + 1, 
                  search: searchTerm, 
                  status: statusFilter,
                  priority: priorityFilter
                }))}
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