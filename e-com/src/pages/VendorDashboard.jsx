import React from 'react';

export default function VendorDashboard() {
  const stats = [
    { name: 'Total Sales', value: '₹48,250.00', change: '+12%', changeType: 'positive' },
    { name: 'Active Orders', value: '18', change: '+4 today', changeType: 'positive' },
    { name: 'Store Products', value: '34', change: '0 pending', changeType: 'neutral' },
  ];

  const recentOrders = [
    { id: 'NEX-8901', customer: 'Aarav Sharma', items: '2x Wireless Earbuds', total: '₹3,998.00', status: 'Processing' },
    { id: 'NEX-8902', customer: 'Ananya Rao', items: '1x Premium Backpack', total: '₹1,499.00', status: 'Shipped' },
    { id: 'NEX-8903', customer: 'Rohan Patel', items: '3x Ceramic Coffee Mugs', total: '₹897.00', status: 'Delivered' },
  ];

  return (
    <div className="py-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendor Management Suite</h1>
          <p className="mt-1 text-sm text-gray-500">Track earnings, update inventory, and manage active tenant dispatches.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c2602b] hover:bg-[#a14b1f] transition-colors focus:outline-none">
            + Add New Product
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{item.value}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                item.changeType === 'positive' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Sections Block */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Main Orders Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Recent Incoming Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead>
                <tr className="text-gray-400 uppercase font-semibold text-xs tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items Purchased</th>
                  <th className="pb-3">Total Price</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 font-medium text-[#c2602b]">{order.id}</td>
                    <td className="py-3.5">{order.customer}</td>
                    <td className="py-3.5 text-gray-500">{order.items}</td>
                    <td className="py-3.5 font-semibold text-gray-900">{order.total}</td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Performance Panel */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Store Performance Details</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 font-medium">Profile Completion</span>
                <span className="text-[#c2602b] font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#c2602b] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Logs</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1.5 font-mono">
                <p>🟢 Vendor connection established</p>
                <p>🔵 Webhook structural synchronization ok</p>
                <p>📅 Current Session: Active 2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}