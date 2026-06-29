import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, AlertTriangle, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
    dispatch(fetchDisputes({ page: currentPage, search: searchTerm, status: statusFilter, priority: priorityFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      open:               { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA', icon: <AlertTriangle className="w-3 h-3" /> },
      under_review:       { bg: '#FEF9C3', color: '#A16207', border: '#FDE047', icon: <Clock className="w-3 h-3" /> },
      vendor_responded:   { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE', icon: <Clock className="w-3 h-3" /> },
      resolved_customer:  { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC', icon: <CheckCircle className="w-3 h-3" /> },
      resolved_vendor:    { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE', icon: <CheckCircle className="w-3 h-3" /> },
      closed:             { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB', icon: <XCircle className="w-3 h-3" /> },
    };
    const s = styles[status] || styles.closed;
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {s.icon}
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
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const statCards = [
    { label: 'Open',              value: statusCounts?.open || 0,              color: '#DC2626', iconBg: '#FEE2E2', border: '#DC2626', Icon: AlertTriangle },
    { label: 'Under Review',      value: statusCounts?.under_review || 0,      color: '#A16207', iconBg: '#FEF9C3', border: '#F59E0B', Icon: Clock },
    { label: 'Vendor Responded',  value: statusCounts?.vendor_responded || 0,  color: '#4338CA', iconBg: '#EEF2FF', border: '#4338CA', Icon: Clock },
    { label: 'Resolved Customer', value: statusCounts?.resolved_customer || 0, color: '#15803D', iconBg: '#DCFCE7', border: '#10B981', Icon: CheckCircle },
    { label: 'Resolved Vendor',   value: statusCounts?.resolved_vendor || 0,   color: '#6D28D9', iconBg: '#F5F3FF', border: '#6D28D9', Icon: CheckCircle },
    { label: 'Closed',            value: statusCounts?.closed || 0,            color: '#374151', iconBg: '#F3F4F6', border: '#6B7280', Icon: XCircle },
  ];

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Open', value: 'open' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Vendor Responded', value: 'vendor_responded' },
    { label: 'Resolved', value: 'resolved_customer' },
    { label: 'Closed', value: 'closed' },
  ];

  if (isLoading && disputes.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: '#F0F2FF', minHeight: '100vh' }}>

      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold" style={{ color: '#1E1B4B' }}>Disputes</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Manage and resolve customer-vendor disputes.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 relative overflow-hidden hover:-translate-y-0.5 transition-all cursor-pointer"
            style={{ border: '1px solid #e0e4f7', boxShadow: '0 2px 0 #C7D2FE, 0 4px 12px rgba(67,56,202,0.08)' }}
            onClick={() => setStatusFilter(card.label === 'All' ? '' : tabs.find(t => t.label === card.label)?.value || '')}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: card.border }} />
            <div className="flex items-center justify-between mb-2 mt-1">
              <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide leading-tight">{card.label}</p>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.iconBg }}>
                <card.Icon className="w-3 h-3" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-[22px] font-bold leading-none" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div
          className="flex items-center rounded-lg p-1 gap-1 flex-wrap"
          style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 0 #e0e4f7' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all"
              style={
                statusFilter === tab.value
                  ? { backgroundColor: '#4338CA', color: '#fff', boxShadow: '0 2px 4px rgba(67,56,202,0.3)' }
                  : { color: '#6b7280' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
              style={{ boxShadow: '0 1px 0 #e0e4f7' }}
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-[12px] font-medium rounded-lg px-3 py-2 border border-gray-200 focus:outline-none bg-white text-gray-600"
            style={{ boxShadow: '0 1px 0 #e0e4f7' }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">{error}</div>
      )}

      {/* Table */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: '1px solid #e0e4f7', boxShadow: '0 3px 0 #C7D2FE, 0 6px 20px rgba(67,56,202,0.08)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
                {['Subject', 'Order', 'Customer', 'Vendor', 'Priority', 'Status', 'Date', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                    style={i === 7 ? { textAlign: 'right' } : {}}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disputes.length > 0 ? (
                disputes.map((dispute) => (
                  <tr
                    key={dispute._id}
                    className="border-b border-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/disputes/${dispute._id}`)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f7ff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-medium text-gray-900 line-clamp-1">{dispute.subject}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{dispute.reason?.replace(/_/g, ' ')}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[11px] font-mono font-semibold px-2 py-1 rounded-md border"
                        style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' }}
                      >
                        {dispute.order?.orderNumber || 'N/A'}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">₹{dispute.order?.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: '#DC2626' }}
                        >
                          {dispute.customer?.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-gray-900">{dispute.customer?.name || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400">{dispute.customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)' }}
                        >
                          {dispute.vendor?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-gray-900">{dispute.vendor?.name || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400">{dispute.vendor?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{getPriorityBadge(dispute.priority)}</td>
                    <td className="px-4 py-3.5">{getStatusBadge(dispute.status)}</td>
                    <td className="px-4 py-3.5 text-[11px] text-gray-400">
                      {new Date(dispute.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/disputes/${dispute._id}`); }}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-md border transition-all"
                        style={{ borderColor: '#e5e7eb', color: '#4338CA', boxShadow: '0 1px 0 #e0e4f7' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = ''}
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-14 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: '#EEF2FF', boxShadow: '0 2px 0 #C7D2FE' }}
                    >
                      <AlertTriangle className="w-5 h-5" style={{ color: '#818CF8' }} />
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">No disputes found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#fafafa' }}>
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchDisputes({ page: currentPage - 1, search: searchTerm, status: statusFilter, priority: priorityFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-md disabled:opacity-40 transition-all text-gray-600"
                style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff', boxShadow: '0 1px 0 #e0e4f7' }}
                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchDisputes({ page: currentPage + 1, search: searchTerm, status: statusFilter, priority: priorityFilter }))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-md disabled:opacity-40 transition-all text-gray-600"
                style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff', boxShadow: '0 1px 0 #e0e4f7' }}
                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
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