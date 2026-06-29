import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Heart, Package, Bell, Sun, Moon } from 'lucide-react';
import {
  NotificationProvider,
  useNotificationContext,
} from '../app/providers/NotificationContext';

export const CustomerLayout = () => (
  <NotificationProvider>
    <CustomerLayoutInner />
  </NotificationProvider>
);

const CustomerLayoutInner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { items = [] } = useSelector((state) => state.cart);
  
  // Calculate total items in cart
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Read unread count from shared context (kept in sync by NotificationProvider)
  const { unreadCount } = useNotificationContext();

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Stores', path: '/stores' },
    { name: 'My Orders', path: '/customer/orders' },
  ];

  return (
    <div className={`customer-shell min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#F8F7FC] text-[#1E1E2F] font-sans antialiased`}>
      {/* Top Navbar - Fixed at the top */}
      <nav className="bg-white/85 backdrop-blur-md border-b border-[#E9E7F5]/90 sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-[#6C4EFF] rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium text-gray-900 tracking-tight">
                Shop<span className="font-bold">Kart</span>
              </span>
            </Link>

            {/* Nav Links with active text colors */}
            <div className="hidden md:flex items-center space-x-8 h-full">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative h-16 flex items-center text-sm font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-[#6C4EFF]'
                        : 'text-[#6B7280] hover:text-[#6C4EFF]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-5">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors duration-300 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4EFF]/30 cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45 text-yellow-500" />
                ) : (
                  <Moon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                )}
              </button>

              {/* Wishlist Icon */}
              <Link to="/wishlist" className="p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors duration-300 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4EFF]/30">
                <Heart className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
              </Link>

              {/* Notification Bell Icon */}
              <Link
                to="/customer/notifications"
                className="p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors duration-300 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4EFF]/30"
                aria-label="Notifications"
              >
                <Bell className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#6C4EFF] text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full shadow-sm leading-none">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors duration-300 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4EFF]/30">
                <ShoppingCart className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#FF3B30] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* User Dropdown */}
              {user ? (
                <div className="relative group py-2">
                  <button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[#F8F7FC] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4EFF]/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#6C4EFF] to-[#9477FF] rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.toLowerCase() || 'swathi'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#E9E7F5]/90 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link to="/customer/profile" className="block px-4 py-2.5 text-sm text-[#1E1E2F] hover:bg-[#ECE7FD] hover:text-[#6C4EFF] rounded-t-2xl font-medium transition-colors">
                      My Profile
                    </Link>
                    <Link to="/customer/orders" className="block px-4 py-2.5 text-sm text-[#1E1E2F] hover:bg-[#ECE7FD] hover:text-[#6C4EFF] font-medium transition-colors">
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-[#E9E7F5] rounded-b-2xl font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6C4EFF] to-[#9477FF] rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                    S
                  </div>
                  <span className="text-sm font-medium text-[#6B7280] hover:text-[#6C4EFF] cursor-pointer">swathi</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-16rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E9E7F5] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#6B7280]">
          <p>© 2026 ShopKart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
