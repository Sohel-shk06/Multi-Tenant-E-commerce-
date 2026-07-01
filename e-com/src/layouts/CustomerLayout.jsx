import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { 
  ShoppingCart, Heart, Package, Bell, Search, Menu, X, 
  User, LogOut, ChevronDown, Home, Grid3x3, Store, 
  ShoppingBag, Mail, Phone, MapPin, ArrowUp
} from 'lucide-react';
import {
  NotificationProvider,
  useNotificationContext,
} from '../app/providers/NotificationContext';

// ✅ Custom Social Media Icons
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const CustomerLayout = () => (
  <NotificationProvider>
    <CustomerLayoutInner />
  </NotificationProvider>
);

const CustomerLayoutInner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [] } = useSelector((state) => state.cart);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { unreadCount } = useNotificationContext();

  // Scroll detection for navbar & scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setShowScrollTop(scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Grid3x3 },
    { name: 'Stores', path: '/stores', icon: Store },
    { name: 'My Orders', path: '/customer/orders', icon: ShoppingBag },
  ];

  const categories = [
    { name: 'Electronics', path: '/products?category=electronics' },
    { name: 'Fashion', path: '/products?category=fashion' },
    { name: 'Home & Kitchen', path: '/products?category=home' },
    { name: 'Books', path: '/products?category=books' },
    { name: 'Sports', path: '/products?category=sports' },
    { name: 'Beauty', path: '/products?category=beauty' },
  ];

  return (
    <div className="customer-shell min-h-screen bg-[#F8F7FC] text-[#1E1E2F] font-sans antialiased overflow-x-hidden">
      
      {/* Announcement Bar - Responsive */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white py-2 px-3 sm:px-4 text-center text-xs sm:text-sm font-medium relative w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 pr-6 sm:pr-8">
            <span className="hidden sm:inline">🎉</span>
            <span className="truncate">Free Shipping on Orders Above ₹499 | Use Code: <strong>WELCOME10</strong> for 10% Off</span>
            <span className="hidden sm:inline">🎉</span>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar - Responsive */}
      <nav className={`bg-white/95 backdrop-blur-md border-b border-[#E9E7F5]/90 sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            
            {/* Left Side */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#6C4EFF] hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6C4EFF] rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-medium text-gray-900 tracking-tight">
                  Shop<span className="font-bold">Kart</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 h-full">
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

              {/* Categories Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="flex items-center space-x-1 text-sm font-semibold text-[#6B7280] hover:text-[#6C4EFF] transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#ECE7FD] hover:text-[#6C4EFF] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2 text-[#6B7280] hover:text-[#6C4EFF] transition-colors rounded-lg sm:rounded-xl hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist - Hidden on very small screens */}
              <Link 
                to={user ? "/wishlist" : "/login"} 
                className="hidden sm:flex p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors rounded-xl hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <Link
                to={user ? "/customer/notifications" : "/login"}
                className="p-1.5 sm:p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors rounded-lg sm:rounded-xl hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#6C4EFF] text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full shadow-sm leading-none">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="p-1.5 sm:p-2 text-[#6B7280] hover:text-[#6C4EFF] relative transition-colors rounded-lg sm:rounded-xl hover:bg-gray-100"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FF3B30] text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              {/* User Menu */}
              {user ? (
                <div className="relative group py-2">
                  <button className="flex items-center space-x-1.5 sm:space-x-2 p-1 sm:p-1.5 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#6C4EFF] to-[#9477FF] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white">
                      <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                      <p className="text-xs opacity-90 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <Link 
                      to="/customer/profile" 
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#ECE7FD] hover:text-[#6C4EFF] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link 
                      to="/customer/orders" 
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#ECE7FD] hover:text-[#6C4EFF] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>

                    <Link 
                      to="/wishlist" 
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#ECE7FD] hover:text-[#6C4EFF] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-[#6C4EFF] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#5A3FE0] transition-colors shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar - Responsive */}
          {searchOpen && (
            <div className="pb-3 sm:pb-4 animate-in slide-in-from-top duration-300">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-16 sm:pr-20 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent text-sm"
                  autoFocus
                />
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#6C4EFF] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#5A3FE0] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-9 h-9 bg-[#6C4EFF] rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium text-gray-900">
                Shop<span className="font-bold">Kart</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.name || 'User'}</p>
                  <p className="text-xs opacity-90 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#ECE7FD] text-[#6C4EFF] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}

            {/* Categories Section */}
            <div className="px-4 py-3 mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="px-4 py-3 mt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Quick Links</p>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <Link
                to="/customer/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </Link>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 p-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/customer/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2.5 bg-[#6C4EFF] text-white text-sm font-medium rounded-lg text-center hover:bg-[#5A3FE0]"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - with bottom padding for mobile nav */}
      <main className="min-h-[calc(100vh-16rem)] pb-16 md:pb-0 w-full">
        <Outlet />
      </main>

      {/* Enhanced Footer - Hidden on Mobile, Visible on Desktop */}
      <footer className="hidden md:block bg-white border-t border-[#E9E7F5] mt-8 md:mt-16 pb-16 md:pb-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-9 h-9 bg-[#6C4EFF] rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-medium text-gray-900">
                  Shop<span className="font-bold">Kart</span>
                </span>
              </Link>
              <p className="text-sm text-gray-600 mb-4">
                Your one-stop destination for all your shopping needs. Quality products, great prices.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#6C4EFF] hover:text-white transition-colors" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#6C4EFF] hover:text-white transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#6C4EFF] hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#6C4EFF] hover:text-white transition-colors" aria-label="Youtube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Home</Link></li>
                <li><Link to="/products" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Products</Link></li>
                <li><Link to="/stores" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Stores</Link></li>
                <li><Link to="/customer/orders" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">My Orders</Link></li>
                <li><Link to="/wishlist" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Wishlist</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Return Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#6C4EFF] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">123 Shopping Street, Mumbai, Maharashtra 400001</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a href="tel:+919876543210" className="text-sm text-gray-600 hover:text-[#6C4EFF]">+91 98765 43210</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a href="mailto:support@shopkart.com" className="text-sm text-gray-600 hover:text-[#6C4EFF]">support@shopkart.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2026 ShopKart. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💳 PayPal</span>
              <span>💳 GPay</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40 shadow-lg safe-bottom w-full">
        <div className="grid grid-cols-4 gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 min-h-[56px] ${
                isActive ? 'text-[#6C4EFF]' : 'text-gray-600'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </NavLink>
          
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 min-h-[56px] ${
                isActive ? 'text-[#6C4EFF]' : 'text-gray-600'
              }`
            }
          >
            <Grid3x3 className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Products</span>
          </NavLink>
          
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 relative min-h-[56px] ${
                isActive ? 'text-[#6C4EFF]' : 'text-gray-600'
              }`
            }
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Cart</span>
          </NavLink>
          
          <NavLink
            to={user ? "/customer/orders" : "/login"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 min-h-[56px] ${
                isActive ? 'text-[#6C4EFF]' : 'text-gray-600'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Account</span>
          </NavLink>
        </div>
      </div>

      {/* Scroll to Top Button (Desktop Only) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hidden md:flex fixed bottom-8 right-8 z-40 w-12 h-12 bg-[#6C4EFF] text-white rounded-full shadow-lg hover:bg-[#5B3EE0] transition-all duration-300 items-center justify-center animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};