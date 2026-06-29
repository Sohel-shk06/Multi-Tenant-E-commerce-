import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommissions, updateCommissionStatus } from '../../app/store/commissionSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, DollarSign, CheckCircle, Clock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const handleStatusChange = (commissionId, newStatus) => {
    if (window.confirm(`Mark this commission as '${newStatus}'?`)) {
      dispatch(updateCommissionStatus({ commissionId, data: { status: newStatus } }));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:   { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      earned:    { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      collected: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
      refunded:  { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
    };
    const s = styles[status] || styles.refunded;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const pendingCount   = commissions.filter(c => c.status === 'pending').length;
  const collectedCount = commissions.filter(c => c.status === 'collected').length;

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Earned', value: 'earned' },
    { label: 'Collected', value: 'collected' },
    { label: 'Refunded', value: 'refunded' },
  ];

  const statCards = [
    {
      label: 'Total', value: totalItems || 0, sub: 'All commissions',
      icon: DollarSign, iconBg: '#EEF2FF', iconColor: '#4338CA',
      subColor: '#6b7280', border: '#6366F1',
    },
    {
      label: 'Pending', value: pendingCount, sub: 'Awaiting collection',
      icon: Clock, iconBg: '#FEF9C3', iconColor: '#A16207',
      subColor: '#A16207', border: '#F59E0B',
    },
    {
      label: 'Collected', value: collectedCount, sub: 'Successfully collected',
      icon: CheckCircle, iconBg: '#DCFCE7', iconColor: '#15803D',
      subColor: '#15803D', border: '#10B981',
    },
    {
      label: 'Revenue', value: '—', sub: 'Platform earnings',
      icon: TrendingUp, iconBg: '#EEF2FF', iconColor: '#4338CA',
      subColor: '#4338CA', border: '#4338CA',
    },
  ];

  if (isLoading && commissions.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: '#F0F2FF', minHeight: '100vh' }}>

      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold" style={{ color: '#1E1B4B' }}>Commissions</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Track and manage platform revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: '#e0e4f7',
              boxShadow: `0 2px 0 #C7D2FE, 0 4px 12px rgba(67,56,202,0.08)`,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
              style={{ background: `linear-gradient(90deg, ${card.border}, ${card.border}99)` }}
            />
            <div className="flex items-center justify-between mb-2 mt-1">
              <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">{card.label}</p>
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon className="w-3.5 h-3.5" style={{ color: card.iconColor }} />
              </div>
            </div>
            <p className="text-[22px] font-bold leading-none" style={{ color: '#1E1B4B' }}>{card.value}</p>
            <p className="text-[11px] mt-1.5" style={{ color: card.subColor }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div
          className="flex items-center rounded-lg p-1 gap-1"
          style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 0 #e0e4f7' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-3 py-1.5 text-[12px] font-medium rounded-md transition-all"
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

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            style={{ boxShadow: '0 1px 0 #e0e4f7' }}
          />
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
                {['Order', 'Vendor', 'Order Amt', 'Commission', 'Vendor Gets', 'Status', 'Date', ''].map((h, i) => (
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
              {commissions.length > 0 ? (
                commissions.map((comm) => (
                  <tr
                    key={comm._id}
                    className="border-b border-gray-50 transition-colors"
                    style={{ borderColor: '#f9fafb' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f7ff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-mono font-semibold px-2 py-1 rounded-md border"
                        style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' }}
                      >
                        {comm.order?.orderNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)', boxShadow: '0 2px 4px rgba(99,102,241,0.3)' }}
                        >
                          {comm.vendor?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{comm.vendor?.name || 'N/A'}</p>
                          <p className="text-[11px] text-gray-400">{comm.vendor?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-semibold text-gray-900">₹{comm.orderAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-semibold" style={{ color: '#15803D' }}>₹{comm.commissionAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-semibold" style={{ color: '#4338CA' }}>₹{comm.vendorAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(comm.status)}</td>
                    <td className="px-4 py-3 text-[11px] text-gray-400">
                      {new Date(comm.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/commissions/${comm._id}`)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border transition-all"
                          style={{ borderColor: '#e5e7eb', color: '#4338CA', boxShadow: '0 1px 0 #e0e4f7' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = ''}
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {comm.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(comm._id, 'collected')}
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-white rounded-lg transition-all"
                            style={{
                              background: 'linear-gradient(135deg,#6366F1,#4338CA)',
                              boxShadow: '0 2px 0 #312E81, 0 3px 8px rgba(67,56,202,0.25)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 0 #312E81, 0 5px 12px rgba(67,56,202,0.3)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 0 #312E81, 0 3px 8px rgba(67,56,202,0.25)' }}
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
                  <td colSpan="8" className="px-6 py-14 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: '#EEF2FF', boxShadow: '0 2px 0 #C7D2FE' }}
                    >
                      <DollarSign className="w-5 h-5" style={{ color: '#818CF8' }} />
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">No commissions found</p>
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
                onClick={() => dispatch(fetchCommissions({ page: currentPage - 1, search: searchTerm, status: statusFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-md disabled:opacity-40 transition-all text-gray-600"
                style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff', boxShadow: '0 1px 0 #e0e4f7' }}
                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchCommissions({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
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