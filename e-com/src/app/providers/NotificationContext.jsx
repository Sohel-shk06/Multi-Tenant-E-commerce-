import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotifications } from '../../services/notification.service';
import { useAuth } from '../../hooks/useAuth';

const NotificationContext = createContext(null);

/**
 * Provides shared notification state (unread count + helpers) to
 * the entire customer layout tree so the navbar bell and the
 * notifications page stay in sync without redundant API calls.
 */
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotifications();
      const notifications =
        data?.notifications ?? data?.data ?? (Array.isArray(data) ? data : []);
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    } catch {
      // Silently fail – badge simply stays at its last known value
    }
  }, [user]);

  /** Called by the notifications page when it marks items as read */
  const decrementUnread = useCallback((by = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - by));
  }, []);

  /** Called when all notifications are marked as read at once */
  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Fetch on mount and whenever the logged-in user changes
  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, refreshUnread, decrementUnread, clearUnread }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/** Convenience hook – throws if used outside NotificationProvider */
export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext must be used inside NotificationProvider');
  }
  return ctx;
};
