import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommission, updateCommissionStatus } from '../../app/store/commissionSlice';
import { ArrowLeft, DollarSign, ShoppingCart, CheckCircle, Clock, XCircle, Store } from 'lucide-react';

export const CommissionDetails = () => {
  const { commissionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCommission: commission, isLoading, error } =
    useSelector((state) => state.commissions);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchCommission(commissionId));
  }, [dispatch, commissionId]);

  const handleCollect = async () => {
    if (window.confirm('Collect this commission?')) {
      setIsUpdating(true);
      try {
        await dispatch(updateCommissionStatus({ commissionId, data: { status: 'collected', notes: 'Manually collected by admin' } }));
        dispatch(fetchCommission(commissionId));
      } catch (e) { alert('Failed: ' + e.message); }
      finally { setIsUpdating(false); }
    }
  };

  const handleRefund = async () => {
    if (window.confirm('Refund this commission?')) {
      setIsUpdating(true);
      try {
        await dispatch(updateCommissionStatus({ commissionId, data: { status: 'refunded', notes: 'Commission refunded by admin' } }));
        dispatch(fetchCommission(commissionId));
      } catch (e) { alert('Failed: ' + e.message); }
      finally { setIsUpdating(false); }
    }
  };

  if (isLoading || !commission) {
    return (
      <div className="min-h-screen bg-[#F3F8F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const statusConfig = {
    pending:   { label: 'Pending',   icon: <Clock className="w-3.5 h-3.5" />,      cls: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' },
    earned:    { label: 'Earned',    icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
    collected: { label: 'Collected', icon: <DollarSign className="w-3.5 h-3.5" />,  cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
    refunded:  { label: 'Refunded',  icon: <XCircle className="w-3.5 h-3.5" />,     cls: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
  };
  const sc = statusConfig[commission.status] || statusConfig.refunded;

  return (
    <div className="min-h-screen bg-[#F3F8F4]">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/commissions')}
            className="flex items-center gap-2 text-green-400 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Commissions
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Commission</p>
              <h1 className="text-3xl font-bold text-white tracking-tight font-mono">
                #{commission.order?.orderNumber || commissionId?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-green-300/70 text-sm mt-1">
                {new Date(commission.createdAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide self-start sm:self-auto ${sc.cls}`}>
              {sc.icon}{sc.label}
            </span>
          </div>

          {/* Financial summary in header */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Order Amount',       value: `₹${commission.orderAmount?.toLocaleString()}`,      color: 'text-white',      iconBg: 'bg-white/10',      icon: <DollarSign className="w-3.5 h-3.5 text-white/70" /> },
              { label: 'Commission Earned',  value: `₹${commission.commissionAmount?.toLocaleString()}`, color: 'text-green-400',  iconBg: 'bg-green-500/20',  icon: <DollarSign className="w-3.5 h-3.5 text-green-400" /> },
              { label: 'Vendor Receives',    value: `₹${commission.vendorAmount?.toLocaleString()}`,     color: 'text-blue-400',   iconBg: 'bg-blue-500/20',   icon: <DollarSign className="w-3.5 h-3.5 text-blue-400" /> },
            ].map(({ label, value, color, iconBg, icon }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-green-300/70 font-medium uppercase tracking-wider">{label}</span>
                  <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
                </div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        {error && (
          <div className="p-4 mb-5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Financial Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Financial Breakdown</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center px-4 py-3.5 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Order Amount</span>
                  <span className="text-base font-bold text-gray-900">₹{commission.orderAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3.5 bg-green-50 rounded-xl border border-green-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Platform Commission</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(commission.commissionRate * 100).toFixed(0)}% of order</p>
                  </div>
                  <span className="text-xl font-bold text-green-600">₹{commission.commissionAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3.5 bg-blue-50 rounded-xl border border-blue-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Vendor Receives</p>
                    <p className="text-xs text-gray-400 mt-0.5">After deduction</p>
                  </div>
                  <span className="text-xl font-bold text-blue-600">₹{commission.vendorAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {commission.order && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Details</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-gray-400">Order Number</span>
                    <Link
                      to={`/admin/orders/${commission.order._id}`}
                      className="text-sm font-mono font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      #{commission.order.orderNumber}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-gray-400">Order Status</span>
                    <span className="text-sm font-semibold capitalize text-gray-700">{commission.order.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">

            {/* Vendor */}
            {commission.vendor && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Store className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vendor</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                      {commission.vendor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{commission.vendor.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{commission.vendor.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                {(commission.status === 'pending' || commission.status === 'earned') && (
                  <>
                    <button
                      onClick={handleCollect}
                      disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {isUpdating
                        ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        : <DollarSign className="w-4 h-4" />}
                      Collect Commission
                    </button>
                    <button
                      onClick={handleRefund}
                      disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isUpdating
                        ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        : <XCircle className="w-4 h-4" />}
                      Refund Commission
                    </button>
                  </>
                )}

                {commission.status === 'collected' && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-800">Commission Collected</p>
                      <p className="text-xs text-blue-500 mt-0.5">Successfully collected from this order.</p>
                    </div>
                  </div>
                )}

                {commission.status === 'refunded' && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <XCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Commission Refunded</p>
                      <p className="text-xs text-gray-400 mt-0.5">This commission has been refunded.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};