import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchOrders, updateOrderStatus } from '../../app/store/orderSlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Eye, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const OrderList = ({ defaultStatus = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, isLoading, error, currentPage, totalPages } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(defaultStatus);

  useEffect(() => {
    setStatusFilter(defaultStatus);
  }, [defaultStatus, location.pathname]);

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:   { bg: '#FEF9C3', color: '#A16207', border: '#FDE047' },
      confirmed: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
      shipped:   { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
      delivered: { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
      completed: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
      cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    };
    const s = styles[status] || styles.pending;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      pending:   ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped:   ['delivered'],
      delivered: ['completed'],
      completed: [],
      cancelled: [],
    };
    return transitions[currentStatus] || [];
  };

  const getPageTitle = () => {
    if (statusFilter === 'pending') return 'Pending Orders';
    if (statusFilter === 'completed') return 'Completed Orders';
    if (statusFilter === 'cancelled') return 'Cancelled Orders';
    return 'Order Management';
  };

  const tabs = [
    { label: 'All Orders', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  if (isLoading && orders.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {statusFilter === 'pending' && 'Review and process pending customer orders.'}
            {statusFilter === 'completed' && 'View all successfully completed orders.'}
            {statusFilter === 'cancelled' && 'View all cancelled orders.'}
            {!statusFilter && 'Track and manage all customer orders.'}
          </p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {!defaultStatus && (
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
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>
          {!defaultStatus && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[12px] font-medium rounded-lg px-3 py-2 border border-gray-200 focus:outline-none bg-white text-gray-600"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-gray-900">{order.orderNumber}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-gray-900">{order.customer?.name}</p>
                      <p className="text-[11px] text-gray-400">{order.customer?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(order.status)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order._id}`); }}
                          className="p-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                          style={{ color: '#4338CA' }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {getNextStatus(order.status).length > 0 && (
                          <div className="relative group">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                            >
                              Update <ChevronDown className="w-3 h-3" />
                            </button>
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              {getNextStatus(order.status).map((status) => (
                                <button
                                  key={status}
                                  onClick={(e) => { e.stopPropagation(); handleStatusChange(order._id, status); }}
                                  className="w-full text-left px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className="text-[13px] font-medium text-gray-500">No orders found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchOrders({ page: currentPage - 1, search: searchTerm, status: statusFilter }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchOrders({ page: currentPage + 1, search: searchTerm, status: statusFilter }))}
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