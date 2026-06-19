import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FailedPayments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions, isLoading, error, currentPage, totalPages } = useSelector((state) => state.payments);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ page: currentPage, search: searchTerm, status: 'failed' }));
  }, [dispatch, currentPage, searchTerm]);

  if (isLoading && transactions.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Failed Payments</h1>
        <p className="text-sm text-gray-500 mt-1">View all failed payment attempts.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Failed At</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-900">{tx.transactionId?.slice(0, 12) || tx._id.slice(0, 12)}...</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{tx.customer?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{tx.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">₹{tx.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 uppercase">{tx.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/payments/${tx._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No failed payments found.
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
                onClick={() => dispatch(fetchTransactions({ page: currentPage - 1, search: searchTerm, status: 'failed' }))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchTransactions({ page: currentPage + 1, search: searchTerm, status: 'failed' }))}
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