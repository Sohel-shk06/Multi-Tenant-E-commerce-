import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navType, setNavType] = useState('Vendor'); 

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Brand Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-[#c2602b] p-2 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-16.5-3z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">NEXCART</span>
            </div>
            
            {/* Desktop Navigation Links based on Sohel's 4 types */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navType === 'Vendor' && (
                <>
                  <a href="#" className="border-[#c2602b] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Vendor Dashboard</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">My Products</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Vendor Orders</a>
                </>
              )}

              {navType === 'Customer' && (
                <>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Shop</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">My Cart</a>
                </>
              )}

              {navType === 'Auth' && (
                <>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Login</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Register</a>
                </>
              )}
            </div>
          </div>

          {/* Right Side Status Panel */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-[#c2602b]">
              Active Workspace: {navType}
            </span>
            <select 
              value={navType} 
              onChange={(e) => setNavType(e.target.value)}
              className="text-xs border border-gray-300 rounded p-1 bg-gray-50 text-gray-600 focus:outline-none"
            >
              <option value="Vendor">Vendor View</option>
              <option value="Customer">Customer View</option>
              <option value="Auth">Auth View</option>
            </select>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel View */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white border-b border-gray-200`}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mobile Nav Panel</p>
          {navType === 'Vendor' && (
            <>
              <a href="#" className="bg-orange-50 border-[#c2602b] text-[#c2602b] block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Vendor Dashboard</a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 block pl-3 pr-4 py-2 text-base font-medium">My Products</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}