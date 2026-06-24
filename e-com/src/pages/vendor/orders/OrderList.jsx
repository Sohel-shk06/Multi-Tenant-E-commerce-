import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchVendorOrders,
  updateVendorOrderStatus,
} from "../../../app/store/vendorOrderSlice";
import {
  Search,
  Eye,
  ChevronDown,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

export const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, currentPage, totalPages, totalOrders, error } =
    useSelector((state) => state.vendorOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchVendorOrders({ page: currentPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to mark this order as '${newStatus}'?`,
      )
    ) {
      dispatch(updateVendorOrderStatus({ orderId, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: ["completed"],
      completed: [],
      cancelled: [],
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
               My Orders 📦
            </h1>
            <p className="text-blue-100 mt-1">
              Track and manage customer orders
            </p>
            <p className="text-sm text-blue-200 mt-2">
              {totalOrders} total orders
            </p>
          </div>

          <button
            onClick={() =>
              dispatch(
                fetchVendorOrders({
                  page: 1,
                  search: searchTerm,
                  status: statusFilter,
                }),
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-xl hover:bg-white/30 transition-all cursor-pointer text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading && orders.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="px-6 py-5">
                      <span className="font-medium text-sm  text-blue-600 hover:text-blue-800 cursor-pointer">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                          {order.customer?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.customer?.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {order.customer?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-green-600 text-base">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/vendor/orders/${order._id}`}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {getNextStatuses(order.status).length > 0 && (
                          <div className="relative group">
                            <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                              <span>Update</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              {getNextStatuses(order.status).map((status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(order._id, status)
                                  }
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize"
                                >
                                  Mark as {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Orders placed by customers will appear here.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  dispatch(
                    fetchVendorOrders({
                      page: currentPage - 1,
                      search: searchTerm,
                      status: statusFilter,
                    }),
                  )
                }
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-white transition-all"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  dispatch(
                    fetchVendorOrders({
                      page: currentPage + 1,
                      search: searchTerm,
                      status: statusFilter,
                    }),
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-white transition-all"
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
