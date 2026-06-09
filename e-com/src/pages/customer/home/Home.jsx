import React from 'react';
import CustomerLayout from '../../../layouts/CustomerLayout';

const Home = () => {
  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-purple-50 shadow-sm overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <span className="uppercase tracking-widest text-purple-500 text-xs font-semibold mb-4 block w-max px-4 py-1.5 rounded-full bg-purple-50">
              Multi-Vendor SaaS Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-800">
              One platform.<br/>
              <span className="text-purple-400">Every store.</span><br/>
              Zero limits.
            </h1>
            <p className="text-gray-500 mb-8 text-lg">
              Launch your digital storefront in minutes. Shop millions of unique items directly from independent vendors across the globe.
            </p>
            <button className="bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 transition shadow-sm shadow-purple-200">
              Start Shopping
            </button>
          </div>
          {/* Ultra-soft background glow */}
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/4 -translate-y-1/4 opacity-80"></div>
        </div>
      </div>
    </CustomerLayout>
  );
};
export default Home;