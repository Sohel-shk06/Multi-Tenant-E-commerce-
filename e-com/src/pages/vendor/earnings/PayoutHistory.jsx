import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { Clock, Plus, AlertCircle } from 'lucide-react';

export const PayoutHistory = () => {
  const [payouts, setPayouts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [overviewData, payoutsData] = await Promise.all([
        vendorService.getEarningsOverview(),
        vendorService.getPayoutHistory({ limit: 10 })
      ]);
      setOverview(overviewData);
      setPayouts(payoutsData.payouts || []);
    } catch (error) {
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) return showMessage('error', 'Enter a valid amount');
    if (amount > overview.availableBalance) return showMessage('error', 'Amount exceeds available balance');

    setRequesting(true);
    try {
      await vendorService.requestPayout(amount);
      showMessage('success', 'Payout request submitted successfully!');
      setPayoutAmount('');
      loadData();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to request payout');
    } finally {
      setRequesting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>{status}</span>;
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payout History</h1>

      {message.text && (
        <div className={`p-4 rounded-lg border flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <AlertCircle className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-gray-500" /> Request Payout
            </h2>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number" step="0.01" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={`Max: ₹${overview.availableBalance.toFixed(2)}`} max={overview.availableBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required
                />
              </div>
              <button type="submit" disabled={requesting || overview.availableBalance <= 0}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
                {requesting ? 'Processing...' : 'Request Withdrawal'}
              </button>
              {overview.availableBalance <= 0 && <p className="text-xs text-red-600 text-center">No available balance.</p>}
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-500" /> Recent Requests</h2>
            </div>
            {payouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map((payout) => (
                      <tr key={payout._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(payout.requestedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{payout.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">{getStatusBadge(payout.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{payout.adminNotes || payout.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">No payout requests yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};