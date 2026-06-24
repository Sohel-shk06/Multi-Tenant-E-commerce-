import { useEffect, useState } from 'react';
import { Bell, ShoppingBag, Tag, ShieldAlert, Check, RefreshCw, CheckCheck } from 'lucide-react';
import * as notificationService from '../../../services/notification.service';

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await notificationService.getNotifications();
      // Ensure we extract notifications array correctly from API response wrapper
      setNotifications(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Instantly update UI state
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    try {
      // Mark each unread notification as read
      await Promise.all(unreadNotifications.map(n => notificationService.markAsRead(n._id)));
      
      // Update UI state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // Helper to format date relatively or nicely
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper to get matching type icon and colors
  const getTypeConfig = (type) => {
    const configs = {
      order_update: {
        icon: ShoppingBag,
        bgClass: 'bg-blue-50 text-blue-600 border-blue-100',
        borderAccent: 'border-l-blue-500'
      },
      promo: {
        icon: Tag,
        bgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        borderAccent: 'border-l-emerald-500'
      },
      security: {
        icon: ShieldAlert,
        bgClass: 'bg-rose-50 text-rose-600 border-rose-100',
        borderAccent: 'border-l-rose-500'
      }
    };

    return configs[type] || {
      icon: Bell,
      bgClass: 'bg-purple-50 text-[#6C4EFF] border-purple-100',
      borderAccent: 'border-l-[#6C4EFF]'
    };
  };

  // Filter list based on active tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-950 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#6C4EFF]" />
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Manage your store alerts, order updates, and promotions
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6C4EFF] hover:bg-[#F2EEFD] rounded-xl transition-colors duration-200"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}

          <button
            onClick={loadNotifications}
            className="p-2 text-gray-400 hover:text-[#6C4EFF] bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all duration-200"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs / Filtering */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread', badge: unreadCount },
          { id: 'read', label: 'Read' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-3 px-4 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-[#6C4EFF] border-b-2 border-[#6C4EFF]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-[#6C4EFF] text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Main content body */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E0D8F9]/80 rounded-3xl shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6C4EFF] mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Loading your alerts...</p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const { icon: IconComponent, bgClass, borderAccent } = getTypeConfig(notif.type);
            return (
              <div
                key={notif._id}
                className={`group relative flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                  notif.isRead
                    ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    : 'bg-[#F2EEFD]/40 border-[#E0D8F9]/70 hover:border-[#6C4EFF]/40 shadow-sm border-l-4 ' + borderAccent
                }`}
              >
                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${bgClass}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm leading-6 truncate ${notif.isRead ? 'font-medium text-gray-900' : 'font-bold text-gray-950'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-[#6C4EFF] rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                    {notif.message}
                  </p>
                  <span className="block text-xs text-gray-400 mt-2 font-medium">
                    {formatNotificationDate(notif.createdAt)}
                  </span>
                </div>

                {/* Mark as read CTA */}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-[#6C4EFF] border border-gray-100 hover:border-[#6C4EFF] rounded-lg transition-all duration-200 sm:opacity-0 group-hover:opacity-100"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-[#E0D8F9]/80 rounded-3xl shadow-sm px-6">
          <div className="w-16 h-16 bg-[#F2EEFD] rounded-full flex items-center justify-center mb-6">
            <Bell className="w-8 h-8 text-[#6C4EFF]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">You're all caught up!</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            No notifications found {activeTab !== 'all' ? `in "${activeTab}"` : ''}. We will alert you here when new updates arrive.
          </p>
        </div>
      )}
    </div>
  );
};
