import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions(1);
  }, []);

  const loadTransactions = async (page) => {
    setLoading(true);
    try {
      const data = await vendorService.getTransactions({ page, limit: 10 });
      setTransactions(data.transactions || []);
      setPagination({ currentPage: data.currentPage, totalPages: data.totalPages });
    } catch (error) {
      console.error('Failed to load transactions', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed breakdown of earnings from completed orders.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Order Total</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Commission (10%)</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Net Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.customer || 'Guest'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">₹{tx.orderTotal.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-red-600 text-right">- ₹{tx.commission.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">₹{tx.netEarnings.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</p>
                <div className="flex space-x-2">
                  <button onClick={() => loadTransactions(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft className="w-4 h-4"/></button>
                  <button onClick={() => loadTransactions(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight className="w-4 h-4"/></button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FileText className="w-12 h-12 text-gray-300 mb-3" />
            <p>No completed transactions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};