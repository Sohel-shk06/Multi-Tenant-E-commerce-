import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Transactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions, isLoading, error, currentPage, totalPages } = useSelector((state) => state.payments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({
      page: currentPage,
      search: searchTerm,
      status: statusFilter,
      paymentMethod: methodFilter
    }));
  }, [dispatch, currentPage, searchTerm, statusFilter, methodFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      paid:     { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      pending:  { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      failed:   { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      refunded: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
    };
    const s = styles[status] || { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' },
  ];

  const statCards = [
    { label: 'Total Volume', value: '—', sub: 'All transactions', subColor: '#6b7280' },
    { label: 'Paid', value: '—', sub: 'Completed', subColor: '#15803D' },
    { label: 'Pending', value: '—', sub: 'Awaiting', subColor: '#A16207' },
    { label: 'Failed', value: '—', sub: 'Failed txns', subColor: '#DC2626' },
    { label: 'Refunded', value: '—', sub: 'Refunded', subColor: '#4338CA' },
  ];

  if (isLoading && transactions.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: '#F5F6FF', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">All Transactions</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">View and manage all payment transactions.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide mb-1">{s.label}</p>
            <p className="text-[20px] font-bold text-gray-900 leading-none">{s.value}</p>
            <p className="text-[11px] mt-1" style={{ color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-[12px] font-medium rounded-lg px-3 py-2 border border-gray-200 focus:outline-none bg-white text-gray-600"
          >
            <option value="">All Methods</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="cod">COD</option>
            <option value="netbanking">Net Banking</option>
          </select>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/payments/${tx._id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-mono text-gray-700">
                        {(tx.transactionId?.slice(0, 14) || tx._id.slice(0, 14))}...
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          style={{ backgroundColor: '#4338CA' }}
                        >
                          {tx.customer?.name?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{tx.customer?.name || 'Guest'}</p>
                          <p className="text-[11px] text-gray-400">{tx.customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold text-gray-900">₹{tx.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border"
                        style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
                      >
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(tx.paymentStatus)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/payments/${tx._id}`); }}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-indigo-50 transition-colors"
                        style={{ color: '#4338CA' }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className="text-[13px] font-medium text-gray-500">No transactions found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchTransactions({ page: currentPage - 1, search: searchTerm, status: statusFilter, paymentMethod: methodFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchTransactions({ page: currentPage + 1, search: searchTerm, status: statusFilter, paymentMethod: methodFilter }))}
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