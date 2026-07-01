import { useState } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AdminNavbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Vendor Registered', message: 'TechStore Pro has registered', time: '5 min ago', unread: true },
    { id: 2, title: 'Order Completed', message: 'Order #12345 has been delivered', time: '1 hour ago', unread: true },
    { id: 3, title: 'Payment Received', message: '₹25,000 received from Fashion Hub', time: '3 hours ago', unread: false },
  ]);

  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleToggleNotifications = () => {
    const nextShow = !showNotifications;
    setShowNotifications(nextShow);
    if (nextShow) setHasViewedNotifications(true);
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search — only md+ */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors, products, orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-3">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && !hasViewedNotifications && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                {/* Mobile: full width centered, Desktop: right-0 fixed width */}
                <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-gray-200
                  right-0 w-[calc(100vw-2rem)] max-w-sm
                  sm:w-80">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notification.unread ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm text-gray-900 truncate ${notification.unread ? 'font-semibold' : 'font-medium'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 z-50 mt-2 bg-white rounded-xl shadow-lg border border-gray-200
                  w-[calc(100vw-2rem)] max-w-[14rem]
                  sm:w-56">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user?.email || 'admin@marketplace.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => { navigate('/admin/profile'); setShowProfileMenu(false); }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => { navigate('/admin/settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      <span>System Settings</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};