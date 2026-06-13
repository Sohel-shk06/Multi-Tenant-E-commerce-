import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Printer, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar, 
  ShieldAlert 
} from "lucide-react";

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // All mock orders
  const mockOrders = {
    "NC-2026-9041": {
      id: "NC-2026-9041",
      date: "2026-06-10T14:30:00.000Z",
      store: "Acoustic Hub",
      status: "delivered",
      paymentMethod: "UPI (Google Pay)",
      paymentStatus: "paid",
      subtotal: 2499,
      tax: 450, // 18% GST included or added
      shippingCost: 0,
      discount: 450,
      totalAmount: 2499,
      shippingAddress: {
        fullName: "Aarohi Sharma",
        phone: "+91 98765 43210",
        street: "Flat 402, Royal Residency, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        zipCode: "201301",
        country: "India"
      },
      items: [
        {
          productId: "prod_noise_smartwatch",
          title: "Noise Pulse Go Slim Smartwatch",
          quantity: 1,
          price: 1599,
          image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=100&q=80",
        },
        {
          productId: "prod_boat_rockerz",
          title: "Boat Rockerz 255 Wireless Earphones",
          quantity: 1,
          price: 900,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=100&q=80",
        },
      ]
    },
    "NC-2026-8712": {
      id: "NC-2026-8712",
      date: "2026-06-12T09:15:00.000Z",
      store: "Tech Haven",
      status: "shipped",
      paymentMethod: "Credit Card (HDFC)",
      paymentStatus: "paid",
      subtotal: 1999,
      tax: 360,
      shippingCost: 80,
      discount: 441,
      totalAmount: 1999,
      shippingAddress: {
        fullName: "Aarohi Sharma",
        phone: "+91 98765 43210",
        street: "Flat 402, Royal Residency, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        zipCode: "201301",
        country: "India"
      },
      items: [
        {
          productId: "prod_oneplus_buds",
          title: "OnePlus Nord Buds 2",
          quantity: 1,
          price: 1999,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=100&q=80",
        }
      ]
    },
    "NC-2026-8153": {
      id: "NC-2026-8153",
      date: "2026-06-13T11:00:00.000Z",
      store: "Wings Audio Store",
      status: "processing",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      subtotal: 1299,
      tax: 234,
      shippingCost: 100,
      discount: 335,
      totalAmount: 1299,
      shippingAddress: {
        fullName: "Aarohi Sharma",
        phone: "+91 98765 43210",
        street: "Flat 402, Royal Residency, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        zipCode: "201301",
        country: "India"
      },
      items: [
        {
          productId: "prod_wings_phantom",
          title: "Wings Phantom Gaming Headphones",
          quantity: 1,
          price: 1299,
          image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=100&q=80",
        }
      ]
    }
  };

  // Find order or default to first
  const order = mockOrders[orderId] || mockOrders["NC-2026-9041"];

  const handleDownloadInvoice = () => {
    alert(`📄 Starting download for Invoice_${order.id}.pdf\nFormat: PDF\nLocal Currency: INR\nAmount: ₹${order.totalAmount}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header back navigation */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-4">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <button
          onClick={handleDownloadInvoice}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl text-xs shadow-sm bg-white cursor-pointer transition"
        >
          <Printer className="w-3.5 h-3.5 text-gray-550" />
          Download Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Invoice Header */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-150 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#cd6615]">NexCart Invoice</span>
            <h1 className="text-2xl font-bold text-gray-900 font-mono mt-1">{order.id}</h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Issued on {new Date(order.date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-1.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-2xl font-extrabold text-gray-950 mt-1">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">All values include applicable GST</span>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-gray-300" />
            Purchased Items
          </h3>
          <div className="border border-gray-150 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-150 text-[10px] uppercase tracking-wider">
                  <th className="p-4">Item Details</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-right">Unit Price</th>
                  <th className="p-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50/50">
                    <td className="p-4 flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                      <span className="font-semibold text-gray-800 line-clamp-1">{item.title}</span>
                    </td>
                    <td className="p-4 text-center text-gray-600 font-medium">{item.quantity}</td>
                    <td className="p-4 text-right text-gray-600 font-medium">₹{item.price.toLocaleString("en-IN")}</td>
                    <td className="p-4 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Delivery address & Payment info */}
            <div className="space-y-6">
              <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Delivery Destination
                </h4>
                <div className="text-xs text-gray-650 space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-1.5 font-medium text-gray-900">📞 {order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Payment Summary
                </h4>
                <div className="text-xs space-y-1.5 text-gray-600">
                  <p>Method: <span className="font-bold text-gray-800 uppercase">{order.paymentMethod}</span></p>
                  <p>
                    Status:{" "}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-850"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col justify-end">
              <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/20 space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Tax / GST (18%)</span>
                  <span className="text-gray-900">₹{order.tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Shipping Cost</span>
                  <span className="text-gray-900">
                    {order.shippingCost === 0 ? (
                      <span className="text-green-600 font-bold uppercase text-xs">Free Shipping</span>
                    ) : (
                      `₹${order.shippingCost.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 font-medium bg-green-50/50 p-2 rounded-xl border border-green-100">
                    <span>Discount Coupon Applied</span>
                    <span className="font-bold">-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-gray-950 font-bold text-base">
                  <span>Invoice Total</span>
                  <span className="text-lg text-[#cd6615]">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-150 text-center text-[10px] text-gray-400 font-medium">
          If you have any questions about this invoice, contact NexCart support. Thank you for your business!
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;