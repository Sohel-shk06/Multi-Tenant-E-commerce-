import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommissions, updateCommissionStatus } from '../../app/store/commissionSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommissionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { commissions, isLoading, error, currentPage, totalPages, totalItems } =
    useSelector((state) => state.commissions);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchCommissions({ page: currentPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      pending:   'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
      earned:    'bg-green-50 text-green-700 ring-1 ring-green-200',
      collected: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
      refunded:  'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (commissionId, newStatus) => {
    if (window.confirm(`Mark this commission as '${newStatus}'?`)) {
      dispatch(updateCommissionStatus({ commissionId, data: { status: newStatus } }));
    }
  };

  if (isLoading && commissions.length === 0) return <PageLoader />;

  const pendingCount   = commissions.filter(c => c.status === 'pending').length;
  const collectedCount = commissions.filter(c => c.status === 'collected').length;

  return (
    <div className="min-h-screen bg-[#F3F8F4]">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Commissions</h1>
          <p className="text-green-300/70 text-sm mt-1">Track and manage platform revenue</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-green-300/70 font-medium uppercase tracking-wider">Total</span>
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{totalItems}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-green-300/70 font-medium uppercase tracking-wider">Pending</span>
                <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-green-300/70 font-medium uppercase tracking-wider">Collected</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{collectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-8 py-6 space-y-5">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="earned">Earned</option>
            <option value="collected">Collected</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order', 'Vendor', 'Order Amount', 'Commission', 'Vendor Gets', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/70">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commissions.length > 0 ? (
                  commissions.map((comm) => (
                    <tr key={comm._id} className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {comm.order?.orderNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">{comm.vendor?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{comm.vendor?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">₹{comm.orderAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-green-600">₹{comm.commissionAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-600 font-semibold">₹{comm.vendorAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(comm.status)}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(comm.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/commissions/${comm._id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {comm.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(comm._id, 'collected')}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                              Collect
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-20 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="w-5 h-5 text-green-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-400">No commissions found</p>
                      <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-400 font-medium">
                Page <span className="text-gray-700 font-bold">{currentPage}</span> of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(fetchCommissions({ page: currentPage - 1, search: searchTerm, status: statusFilter }))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors text-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={() => dispatch(fetchCommissions({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors text-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};