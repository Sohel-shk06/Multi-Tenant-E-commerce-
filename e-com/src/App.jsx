import React from 'react';
import Navbar from './app/Navbar.jsx'; 
import VendorDashboard from './pages/VendorDashboard.jsx';
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VendorDashboard />
      </div>
    </div>
  );
}

export default App;