import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayouts, updatePayoutStatus } from '../../app/store/paymentSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { CheckCircle, XCircle, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export const Payouts = () => {
  const dispatch = useDispatch();
  const { payouts, isLoading, error, currentPage, totalPages } = useSelector((state) => state.payments);
  const [statusFilter, setStatusFilter] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPayouts({ page: currentPage, status: statusFilter }));
  }, [dispatch, currentPage, statusFilter]);

  const handleStatusUpdate = async (payoutId, status) => {
    const notes = prompt(`Enter notes for ${status} (optional):`);
    if (notes === null) return;
    setProcessingId(payoutId);
    try {
      await dispatch(updatePayoutStatus({ payoutId, data: { status, notes } })).unwrap();
      alert(`Payout ${status} successfully!`);
    } catch (err) {
      alert(err || 'Failed to update payout');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:   { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      processed: { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      failed:    { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      rejected:  { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
    };
    const s = styles[status] || { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processed', value: 'processed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Rejected', value: 'rejected' },
  ];

  if (isLoading && payouts.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">Vendor Payouts</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Manage vendor payout requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 gap-1 w-fit">
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Requested</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Notes</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <tr key={payout._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                          style={{ backgroundColor: '#4338CA' }}
                        >
                          {payout.vendor?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{payout.vendor?.name}</p>
                          <p className="text-[11px] text-gray-400">{payout.vendor?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold text-gray-900">
                        ₹{payout.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(payout.requestedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(payout.status)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-400 max-w-[150px] truncate">
                      {payout.adminNotes || payout.notes || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {payout.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(payout._id, 'processed')}
                            disabled={processingId === payout._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white rounded-md disabled:opacity-50 transition-colors"
                            style={{ backgroundColor: '#15803D' }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(payout._id, 'rejected')}
                            disabled={processingId === payout._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white rounded-md disabled:opacity-50 transition-colors"
                            style={{ backgroundColor: '#DC2626' }}
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-dashed border-gray-200"
                      style={{ backgroundColor: '#EEF2FF' }}
                    >
                      <DollarSign className="w-5 h-5" style={{ color: '#818CF8' }} />
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">No payouts found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your filter</p>
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
                onClick={() => dispatch(fetchPayouts({ page: currentPage - 1, status: statusFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchPayouts({ page: currentPage + 1, status: statusFilter }))}
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