import { Link } from "react-router-dom";
import { Package, Eye, Star, MapPin, Truck } from "lucide-react";

export const MyOrders = () => {
  // Sleek mock orders dataset
  const mockOrders = [
    {
      id: "NC-2026-9041",
      date: "2026-06-10T14:30:00.000Z",
      store: "Acoustic Hub",
      status: "delivered", // Green
      totalAmount: 2499,
      paymentMethod: "UPI",
      paymentStatus: "paid",
      items: [
        {
          id: "item_1",
          productId: "prod_noise_smartwatch",
          title: "Noise Pulse Go Slim Smartwatch",
          quantity: 1,
          price: 1599,
          image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=100&q=80",
        },
        {
          id: "item_2",
          productId: "prod_boat_rockerz",
          title: "Boat Rockerz 255 Wireless Earphones",
          quantity: 1,
          price: 900,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=100&q=80",
        },
      ],
    },
    {
      id: "NC-2026-8712",
      date: "2026-06-12T09:15:00.000Z",
      store: "Tech Haven",
      status: "shipped", // Blue
      totalAmount: 1999,
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      items: [
        {
          id: "item_3",
          productId: "prod_oneplus_buds",
          title: "OnePlus Nord Buds 2",
          quantity: 1,
          price: 1999,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=100&q=80",
        },
      ],
    },
    {
      id: "NC-2026-8153",
      date: "2026-06-13T11:00:00.000Z",
      store: "Wings Audio Store",
      status: "processing", // Yellow
      totalAmount: 1299,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      items: [
        {
          id: "item_4",
          productId: "prod_wings_phantom",
          title: "Wings Phantom Gaming Headphones",
          quantity: 1,
          price: 1299,
          image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=100&q=80",
        },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      delivered: "bg-green-50 text-green-700 border-green-200",
      shipped: "bg-blue-50 text-blue-700 border-blue-200",
      processing: "bg-yellow-50 text-yellow-700 border-yellow-250",
    };
    const colors = badges[status] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "delivered" ? "bg-green-600" :
          status === "shipped" ? "bg-blue-600" : "bg-yellow-600"
        }`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your post-purchase order history and check shipping status
        </p>
      </div>

      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Order Header */}
            <div className="p-4 bg-gray-55/60 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-gray-800 tracking-wide font-mono">
                  ORDER ID: {order.id}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-sm font-bold text-gray-900">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 sm:p-5 divide-y divide-gray-100">
              <div className="pb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-gray-400" />
                  Store: {order.store}
                </span>
                <span className="text-xs text-gray-400">{order.items.length} Item(s)</span>
              </div>

              <div className="pt-4 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start sm:items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-950 shrink-0 text-right">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Actions */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-gray-400 font-medium">
                Payment Method: <span className="uppercase text-gray-600 font-semibold">{order.paymentMethod}</span>
                <span className="mx-2">•</span>
                Status: <span className={`capitalize font-semibold ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                {order.status === "delivered" && (
                  <Link
                    to={`/reviews/write?productId=${order.items[0].productId}&orderId=${order.id}`}
                    className="inline-flex items-center gap-1 text-[#cd6615] hover:text-[#b2550f] transition"
                  >
                    <Star className="w-4 h-4 text-[#cd6615] fill-current" />
                    Write Review
                  </Link>
                )}

                <Link
                  to={`/orders/${order.id}/track`}
                  className="inline-flex items-center gap-1 text-gray-650 hover:text-gray-900 transition"
                >
                  <Truck className="w-4 h-4 text-gray-400" />
                  Track Order
                </Link>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  View Invoice
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;