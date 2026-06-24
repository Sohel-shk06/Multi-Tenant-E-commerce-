import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notification.service';
import { 
  LayoutDashboard, Package, ShoppingCart, DollarSign, 
  Store, Star, Settings, LogOut, Menu, X, BarChart3, 
  ChevronDown, ChevronRight, Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const VendorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [earningsOpen, setEarningsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auto-open earnings menu if user is on any earnings page
  useEffect(() => {
    if (location.pathname.startsWith('/vendor/earnings')) {
      setEarningsOpen(true);
    }
  }, [location.pathname]);

  // ✅ NEW: Load unread notification count
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to load unread count', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/vendor/dashboard' },
    { title: 'My Products', icon: Package, path: '/vendor/products' },
    { title: 'Orders', icon: ShoppingCart, path: '/vendor/orders' },
    { title: 'My Stores', icon: Store, path: '/vendor/stores' },
    { 
      title: 'Earnings', 
      icon: DollarSign, 
      path: '/vendor/earnings',
      subItems: [
        { title: 'Overview', path: '/vendor/earnings' },
        { title: 'Payout History', path: '/vendor/earnings/payouts' },
        { title: 'Transactions', path: '/vendor/earnings/transactions' },
        { title: 'Commission', path: '/vendor/earnings/commission' },
      ]
    },
    { title: 'Reviews', icon: Star, path: '/vendor/reviews' },
    { title: 'Analytics', icon: BarChart3, path: '/vendor/analytics' },
    { title: 'Settings', icon: Settings, path: '/vendor/settings' },
  ];

  const isActive = (path) => location.pathname === path;
  const isAnySubActive = (subItems) => subItems?.some(sub => location.pathname === sub.path);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Market place</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'V'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">Vendor</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const active = isActive(item.path) || isAnySubActive(item.subItems);

              return (
                <div key={item.path}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => setEarningsOpen(!earningsOpen)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
                          ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        {earningsOpen ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      
                      {earningsOpen && (
                        <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                block px-3 py-2 text-sm rounded-md transition-colors
                                ${isActive(sub.path)
                                  ? 'text-blue-700 bg-blue-50 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }
                              `}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg font-semibold text-gray-900">
                {location.pathname.includes('/earnings') ? 'Earnings Management' : 'Vendor Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* ✅ NEW: Notification Bell Icon */}
              <Link 
                to="/vendor/notifications" 
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/vendor/settings" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'V'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};