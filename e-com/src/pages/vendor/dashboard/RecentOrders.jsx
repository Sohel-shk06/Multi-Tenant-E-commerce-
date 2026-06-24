import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const RecentOrders = ({ orders = [] }) => {
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status?.toLowerCase()] || styles.pending;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Orders
        </h2>

        <Link
          to="/vendor/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Order ID
              </th>

              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Customer
              </th>

              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Amount
              </th>

              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Status
              </th>

              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 font-medium text-gray-800">
                  #{order._id?.slice(-6)}
                </td>

                <td className="py-4 text-gray-600">
                  {order.shippingAddress?.fullName ||
                    order.user?.name ||
                    "Customer"}
                </td>

                <td className="py-4 font-medium text-gray-800">
                  ₹{order.totalAmount?.toLocaleString()}
                </td>

                <td className="py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="py-4 text-right">
                  <Link
                    to={`/vendor/orders/${order._id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100"
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recentOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No recent orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;