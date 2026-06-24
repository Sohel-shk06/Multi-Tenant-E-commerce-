import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../../services/notification.service';
import { Bell, Check, CheckCheck, Trash2, ShoppingCart, Star, DollarSign, Package, Settings } from 'lucide-react';

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 50 };
      if (filter === 'unread') params.unreadOnly = 'true';
      
      const data = await notificationService.getNotifications(params);
      setNotifications(data.notifications || data);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      order: ShoppingCart,
      order_update: ShoppingCart,
      review: Star,
      payment: DollarSign,
      product: Package,
      system: Settings,
      promo: Star,
      security: Settings
    };
    const Icon = icons[type] || Bell;
    return <Icon className="w-5 h-5" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      order: 'bg-blue-100 text-blue-600',
      order_update: 'bg-blue-100 text-blue-600',
      review: 'bg-yellow-100 text-yellow-600',
      payment: 'bg-green-100 text-green-600',
      product: 'bg-purple-100 text-purple-600',
      system: 'bg-gray-100 text-gray-600',
      promo: 'bg-yellow-100 text-yellow-600',
      security: 'bg-red-100 text-red-600'
    };
    return colors[type] || colors.system;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-green-600" />
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-2">
            {filter === 'unread' ? 'No unread notifications' : 'You have no notifications yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${
                notification.isRead ? 'border-gray-200' : 'border-green-300 bg-green-50/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};