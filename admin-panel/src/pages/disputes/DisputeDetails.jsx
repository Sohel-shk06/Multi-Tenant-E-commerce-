import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispute, resolveDispute, updateDisputeStatus } from '../../app/store/disputeSlice';
import {
  ArrowLeft, AlertTriangle, CheckCircle, Clock, XCircle,
  User, Store, ShoppingCart, MessageSquare
} from 'lucide-react';
import { ResolveDispute } from './ResolveDispute';
import { PageLoader } from '../../components/loaders/PageLoader';

export const DisputeDetails = () => {
  const { disputeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDispute: dispute, isLoading, error } = useSelector((state) => state.disputes);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDispute(disputeId));
  }, [dispatch, disputeId]);

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Change status to '${newStatus}'?`)) {
      dispatch(updateDisputeStatus({ disputeId, data: { status: newStatus } }));
    }
  };

  if (isLoading || !dispute) return <PageLoader />;

  const getStatusBadge = (status) => {
    const styles = {
      open:               { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      under_review:       { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      vendor_responded:   { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
      resolved_customer:  { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      resolved_vendor:    { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
      closed:             { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
    };
    const s = styles[status] || styles.closed;
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low:    { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
      medium: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
      high:   { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
      urgent: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    };
    const s = styles[priority] || styles.low;
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)} Priority
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

  const msgStyle = {
    admin:    { bg: '#EEF2FF', border: '#C7D2FE', color: '#4338CA' },
    customer: { bg: '#DCFCE7', border: '#86EFAC', color: '#15803D' },
    vendor:   { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5" style={{ backgroundColor: '#F0F2FF', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/disputes')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white transition-all hover:-translate-y-0.5"
            style={{ borderColor: '#e0e4f7', boxShadow: '0 2px 0 #C7D2FE' }}
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold" style={{ color: '#1E1B4B' }}>{dispute.subject}</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Opened on {new Date(dispute.openedAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {getPriorityBadge(dispute.priority)}
          {getStatusBadge(dispute.status)}
        </div>
      </div>

      {/* Quick Actions */}
      {dispute.status !== 'closed' && (
        <div
          className="bg-white rounded-xl p-4 flex flex-wrap gap-2"
          style={{ border: '1px solid #e0e4f7', boxShadow: '0 2px 0 #C7D2FE' }}
        >
          {dispute.status === 'open' && (
            <button
              onClick={() => handleStatusChange('under_review')}
              className="px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#FEF9C3', color: '#A16207', border: '1px solid #FDE047', boxShadow: '0 2px 0 #FDE047' }}
            >
              Mark Under Review
            </button>
          )}
          {(dispute.status === 'under_review' || dispute.status === 'vendor_responded') && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)', boxShadow: '0 2px 0 #312E81, 0 3px 8px rgba(67,56,202,0.25)' }}
            >
              Resolve Dispute
            </button>
          )}
          <button
            onClick={() => handleStatusChange('closed')}
            className="px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', boxShadow: '0 2px 0 #D1D5DB' }}
          >
            Close Dispute
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left */}
        <div className="lg:col-span-2 space-y-4">

          {/* Dispute Details */}
          <div style={card3d}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              {iconWrap('#FEE2E2', '#DC2626', AlertTriangle)}
              <p className="text-[13px] font-semibold text-gray-900">Dispute Details</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Reason</p>
                <p
                  className="text-[13px] text-gray-900 p-3 rounded-lg border"
                  style={{ backgroundColor: '#fafafa', borderColor: '#f3f4f6' }}
                >
                  {dispute.reason?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
                <p
                  className="text-[13px] text-gray-900 p-3 rounded-lg border whitespace-pre-wrap"
                  style={{ backgroundColor: '#fafafa', borderColor: '#f3f4f6' }}
                >
                  {dispute.description}
                </p>
              </div>
              {dispute.resolution !== 'none' && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Resolution</p>
                  <p
                    className="text-[13px] p-3 rounded-lg border"
                    style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC', color: '#15803D' }}
                  >
                    <span className="font-semibold">{dispute.resolution?.replace(/_/g, ' ').toUpperCase()}</span>
                    {dispute.refundAmount > 0 && (
                      <span className="ml-2">— Refund: ₹{dispute.refundAmount.toLocaleString()}</span>
                    )}
                  </p>
                </div>
              )}
              {dispute.adminNotes && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Admin Notes</p>
                  <p
                    className="text-[13px] p-3 rounded-lg border"
                    style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', color: '#312E81' }}
                  >
                    {dispute.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={card3d}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              {iconWrap('#EEF2FF', '#4338CA', MessageSquare)}
              <p className="text-[13px] font-semibold text-gray-900">
                Conversation ({dispute.messages?.length || 0})
              </p>
            </div>
            <div className="p-5 space-y-3">
              {dispute.messages?.map((msg, idx) => {
                const ms = msgStyle[msg.senderRole] || msgStyle.admin;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border"
                    style={{ backgroundColor: ms.bg, borderColor: ms.border }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: ms.border, color: ms.color }}
                        >
                          {msg.senderRole}
                        </span>
                        <span className="text-[12px] text-gray-600 font-medium">{msg.sender?.name || 'Unknown'}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-900 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                );
              })}
              {(!dispute.messages || dispute.messages.length === 0) && (
                <p className="text-[12px] text-gray-400 text-center py-4">No messages yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* Order Info */}
          {dispute.order && (
            <div style={card3d}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                {iconWrap('#EEF2FF', '#4338CA', ShoppingCart)}
                <p className="text-[13px] font-semibold text-gray-900">Order Details</p>
              </div>
              <div className="p-5 space-y-2.5">
                {[
                  { label: 'Order Number', value: dispute.order.orderNumber, mono: true },
                  { label: 'Total Amount', value: `₹${dispute.order.totalAmount?.toLocaleString()}`, bold: true },
                  { label: 'Status', value: dispute.order.status },
                  { label: 'Payment', value: dispute.order.paymentStatus },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">{row.label}</span>
                    <span
                      className={`text-[12px] capitalize ${row.bold ? 'font-bold text-gray-900' : 'font-medium text-gray-700'} ${row.mono ? 'font-mono' : ''}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer */}
          {dispute.customer && (
            <div style={card3d}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                {iconWrap('#DCFCE7', '#15803D', User)}
                <p className="text-[13px] font-semibold text-gray-900">Customer</p>
              </div>
              <div className="p-5 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                  style={{ backgroundColor: '#DC2626', boxShadow: '0 2px 0 #B91C1C' }}
                >
                  {dispute.customer.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{dispute.customer.name}</p>
                  <p className="text-[11px] text-gray-400">{dispute.customer.email}</p>
                  {dispute.customer.phone && <p className="text-[11px] text-gray-400">{dispute.customer.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Vendor */}
          {dispute.vendor && (
            <div style={card3d}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                {iconWrap('#F5F3FF', '#6D28D9', Store)}
                <p className="text-[13px] font-semibold text-gray-900">Vendor</p>
              </div>
              <div className="p-5 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)', boxShadow: '0 2px 0 #312E81' }}
                >
                  {dispute.vendor.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{dispute.vendor.name}</p>
                  <p className="text-[11px] text-gray-400">{dispute.vendor.email}</p>
                  {dispute.vendor.phone && <p className="text-[11px] text-gray-400">{dispute.vendor.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={card3d}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              {iconWrap('#EEF2FF', '#4338CA', Clock)}
              <p className="text-[13px] font-semibold text-gray-900">Timeline</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#DC2626' }} />
                <div>
                  <p className="text-[12px] font-medium text-gray-900">Dispute Opened</p>
                  <p className="text-[11px] text-gray-400">{new Date(dispute.openedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              {dispute.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#15803D' }} />
                  <div>
                    <p className="text-[12px] font-medium text-gray-900">Dispute Resolved</p>
                    <p className="text-[11px] text-gray-400">{new Date(dispute.resolvedAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResolveModal && (
        <ResolveDispute dispute={dispute} onClose={() => setShowResolveModal(false)} />
      )}
    </div>
  );
};