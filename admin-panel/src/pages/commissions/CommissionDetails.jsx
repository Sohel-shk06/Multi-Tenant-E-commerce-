import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommission, updateCommissionStatus } from '../../app/store/commissionSlice';
import { ArrowLeft, DollarSign, ShoppingCart, CheckCircle, Clock, XCircle, Store } from 'lucide-react';
import { PageLoader } from '../../components/loaders/PageLoader';

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

  if (isLoading || !commission) return <PageLoader />;

  const getStatusBadge = (status) => {
    const styles = {
      pending:   { bg: '#FEF9C3', color: '#A16207', border: '#FDE047', icon: <Clock className="w-3.5 h-3.5" /> },
      earned:    { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC', icon: <CheckCircle className="w-3.5 h-3.5" /> },
      collected: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE', icon: <DollarSign className="w-3.5 h-3.5" /> },
      refunded:  { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB', icon: <XCircle className="w-3.5 h-3.5" /> },
    };
    const s = styles[status] || styles.refunded;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {s.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const card3d = {
    background: '#fff',
    border: '1px solid #e0e4f7',
    boxShadow: '0 3px 0 #C7D2FE, 0 6px 16px rgba(67,56,202,0.07)',
    borderRadius: '14px',
    overflow: 'hidden',
  };

  const iconWrap = (bg, color, Icon) => (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5" style={{ backgroundColor: '#F0F2FF', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/commissions')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white transition-all hover:-translate-y-0.5"
            style={{ borderColor: '#e0e4f7', boxShadow: '0 2px 0 #C7D2FE' }}
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold" style={{ color: '#1E1B4B' }}>
              Commission #{commission.order?.orderNumber || commissionId?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {new Date(commission.createdAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {getStatusBadge(commission.status)}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">{error}</div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Order Amount', value: `₹${commission.orderAmount?.toLocaleString()}`, color: '#1E1B4B', border: '#6366F1', iconBg: '#EEF2FF', iconColor: '#4338CA', Icon: DollarSign },
          { label: 'Commission Earned', value: `₹${commission.commissionAmount?.toLocaleString()}`, color: '#15803D', border: '#10B981', iconBg: '#DCFCE7', iconColor: '#15803D', Icon: DollarSign },
          { label: 'Vendor Receives', value: `₹${commission.vendorAmount?.toLocaleString()}`, color: '#4338CA', border: '#4338CA', iconBg: '#EEF2FF', iconColor: '#4338CA', Icon: DollarSign },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 relative overflow-hidden hover:-translate-y-0.5 transition-all"
            style={{ border: '1px solid #e0e4f7', boxShadow: `0 2px 0 #C7D2FE, 0 4px 12px rgba(67,56,202,0.08)` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: s.border }} />
            <div className="flex items-center justify-between mb-2 mt-1">
              <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">{s.label}</p>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.iconBg }}>
                <s.Icon className="w-3.5 h-3.5" style={{ color: s.iconColor }} />
              </div>
            </div>
            <p className="text-[22px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left */}
        <div className="lg:col-span-2 space-y-4">

          {/* Financial Breakdown */}
          <div style={card3d}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              {iconWrap('#DCFCE7', '#15803D', DollarSign)}
              <p className="text-[13px] font-semibold text-gray-900">Financial Breakdown</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                <span className="text-[13px] text-gray-500">Order Amount</span>
                <span className="text-[14px] font-bold text-gray-900">₹{commission.orderAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 rounded-xl border" style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }}>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">Platform Commission</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{(commission.commissionRate * 100).toFixed(0)}% of order</p>
                </div>
                <span className="text-[18px] font-bold" style={{ color: '#15803D' }}>₹{commission.commissionAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 rounded-xl border" style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">Vendor Receives</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">After deduction</p>
                </div>
                <span className="text-[18px] font-bold" style={{ color: '#4338CA' }}>₹{commission.vendorAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          {commission.order && (
            <div style={card3d}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                {iconWrap('#EEF2FF', '#4338CA', ShoppingCart)}
                <p className="text-[13px] font-semibold text-gray-900">Order Details</p>
              </div>
              <div>
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-50">
                  <span className="text-[12px] text-gray-400">Order Number</span>
                  <Link
                    to={`/admin/orders/${commission.order._id}`}
                    className="text-[12px] font-mono font-bold px-2 py-0.5 rounded-md border transition-colors"
                    style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
                  >
                    #{commission.order.orderNumber}
                  </Link>
                </div>
                <div className="flex justify-between items-center px-5 py-3.5">
                  <span className="text-[12px] text-gray-400">Order Status</span>
                  <span className="text-[13px] font-semibold capitalize text-gray-700">{commission.order.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* Vendor */}
          {commission.vendor && (
            <div style={card3d}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                {iconWrap('#FEF9C3', '#A16207', Store)}
                <p className="text-[13px] font-semibold text-gray-900">Vendor</p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[16px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)', boxShadow: '0 3px 0 #312E81, 0 4px 10px rgba(99,102,241,0.3)' }}
                  >
                    {commission.vendor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 truncate">{commission.vendor.name}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{commission.vendor.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={card3d}>
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-900">Actions</p>
            </div>
            <div className="p-5 space-y-3">
              {(commission.status === 'pending' || commission.status === 'earned') && (
                <>
                  <button
                    onClick={handleCollect}
                    disabled={isUpdating}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg,#6366F1,#4338CA)',
                      boxShadow: '0 3px 0 #312E81, 0 4px 10px rgba(67,56,202,0.25)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 0 #312E81, 0 6px 14px rgba(67,56,202,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 3px 0 #312E81, 0 4px 10px rgba(67,56,202,0.25)' }}
                  >
                    {isUpdating
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <DollarSign className="w-4 h-4" />}
                    Collect Commission
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={isUpdating}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-lg border transition-all disabled:opacity-50"
                    style={{
                      color: '#DC2626', backgroundColor: '#FEE2E2',
                      borderColor: '#FECACA', boxShadow: '0 2px 0 #FECACA'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                  >
                    {isUpdating
                      ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <XCircle className="w-4 h-4" />}
                    Refund Commission
                  </button>
                </>
              )}

              {commission.status === 'collected' && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}>
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4338CA' }} />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#312E81' }}>Commission Collected</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Successfully collected from this order.</p>
                  </div>
                </div>
              )}

              {commission.status === 'refunded' && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                  <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-600">Commission Refunded</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">This commission has been refunded.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};