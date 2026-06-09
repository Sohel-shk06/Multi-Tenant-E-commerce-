import React from 'react';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 font-sans">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Soft Pastel Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="bg-purple-300 text-purple-900 rounded-md w-8 h-8 flex items-center justify-center font-bold mr-3">V</div>
              <span className="text-xl font-bold tracking-tight text-gray-800">Vendrix</span>
            </div>
            {/* Soft Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-300 text-sm outline-none text-gray-700 placeholder-gray-400 transition-colors" placeholder="Search for products, brands and more..." />
                <button className="absolute right-3 top-2 text-gray-400 hover:text-purple-400">🔍</button>
              </div>
            </div>
            {/* Lighter Action Buttons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-500 hover:text-purple-500 font-medium text-sm transition">Profile</button>
              <button className="text-gray-500 hover:text-purple-500 font-medium text-sm transition flex items-center">
                🛒 <span className="ml-2 bg-purple-300 text-purple-900 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};
export default CustomerLayout;