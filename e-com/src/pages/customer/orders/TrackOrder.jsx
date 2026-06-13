import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, Circle, Truck, MapPin } from "lucide-react";

export const TrackOrder = () => {
  const { orderId } = useParams();

  // Mock shipping states mapping
  const orderDetails = {
    "NC-2026-9041": {
      id: "NC-2026-9041",
      carrier: "Delhivery Express",
      trackingId: "DX-98213812",
      estimatedDelivery: "Delivered on June 12, 2026",
      status: "delivered",
      timeline: [
        { title: "Order Placed", desc: "Your order was successfully submitted.", time: "June 10, 02:30 PM", done: true },
        { title: "Processing", desc: "Vendor has confirmed and packaged the items.", time: "June 11, 10:00 AM", done: true },
        { title: "Dispatched", desc: "Package picked up by Delhivery Express.", time: "June 11, 04:30 PM", done: true },
        { title: "Out for Delivery", desc: "Courier partner is en route to your address.", time: "June 12, 09:00 AM", done: true },
        { title: "Delivered", desc: "Package handed over to customer.", time: "June 12, 02:15 PM", done: true },
      ]
    },
    "NC-2026-8712": {
      id: "NC-2026-8712",
      carrier: "BlueDart Standard",
      trackingId: "BD-472183901",
      estimatedDelivery: "Expected by June 15, 2026",
      status: "shipped",
      timeline: [
        { title: "Order Placed", desc: "Your order was successfully submitted.", time: "June 12, 09:15 AM", done: true },
        { title: "Processing", desc: "Vendor has confirmed and packaged the items.", time: "June 12, 02:00 PM", done: true },
        { title: "Dispatched", desc: "Package in transit at BlueDart Hub.", time: "June 13, 08:30 AM", done: true },
        { title: "Out for Delivery", desc: "Courier partner is en route to your address.", time: "Pending", done: false },
        { title: "Delivered", desc: "Package handed over to customer.", time: "Pending", done: false },
      ]
    },
    "NC-2026-8153": {
      id: "NC-2026-8153",
      carrier: "NexCart Logistics",
      trackingId: "NCL-73281928",
      estimatedDelivery: "Expected by June 17, 2026",
      status: "processing",
      timeline: [
        { title: "Order Placed", desc: "Your order was successfully submitted.", time: "June 13, 11:00 AM", done: true },
        { title: "Processing", desc: "Vendor is packing your items.", time: "June 13, 03:00 PM", done: true },
        { title: "Dispatched", desc: "In transit to courier partner.", time: "Pending", done: false },
        { title: "Out for Delivery", desc: "Courier partner is en route to your address.", time: "Pending", done: false },
        { title: "Delivered", desc: "Package handed over to customer.", time: "Pending", done: false },
      ]
    }
  };

  const currentOrder = orderDetails[orderId] || orderDetails["NC-2026-9041"];

  return (
    <div className="space-y-6">
      {/* Back to Orders */}
      <div className="border-b border-gray-150 pb-4">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Info panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-150 text-xs sm:text-sm">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Order Reference</span>
            <span className="font-bold text-gray-900 font-mono text-base block mt-1">{currentOrder.id}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Courier Partner</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-gray-800">
              <Truck className="w-4 h-4 text-gray-400" />
              <span>{currentOrder.carrier}</span>
            </div>
            <span className="text-xs text-gray-550 block mt-0.5">ID: {currentOrder.trackingId}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Status Update</span>
            <span className="font-bold text-[#cd6615] block mt-1">{currentOrder.estimatedDelivery}</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="py-8 max-w-xl mx-auto">
          <div className="relative pl-8 border-l-2 border-gray-150 space-y-8">
            {currentOrder.timeline.map((step, index) => {
              const isLast = index === currentOrder.timeline.length - 1;
              
              return (
                <div key={step.title} className="relative">
                  {/* Dot/Icon overlay */}
                  <span className="absolute -left-[41px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    {step.done ? (
                      <CheckCircle2 className="h-6 w-6 text-[#cd6615] fill-orange-50/50" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 fill-white" />
                    )}
                  </span>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-sm font-bold ${step.done ? "text-gray-900" : "text-gray-400"}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${
                        step.done ? "bg-gray-100 text-gray-650" : "bg-gray-50 text-gray-300"
                      }`}>
                        {step.time}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${step.done ? "text-gray-600" : "text-gray-350"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 text-xs text-gray-500">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <span>Real-time tracking updates are processed in coordination with shipping providers.</span>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
