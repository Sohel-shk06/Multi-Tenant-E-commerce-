import { useEffect, useState } from 'react';
import { notificationService } from '../../../services/notification.service';
import { Bell, Mail, Save } from 'lucide-react';

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState({
    emailNewOrder: true,
    emailNewReview: true,
    emailPayment: true,
    emailSystem: true,
    inAppNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await notificationService.updatePreferences(preferences);
      setSuccess('✅ Preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-green-600" />
          Notification Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure how you want to receive notifications.</p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* In-App Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            In-App Notifications
          </h2>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable In-App Notifications</p>
              <p className="text-xs text-gray-500">Show notifications inside the platform</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.inAppNotifications}
              onChange={(e) => setPreferences({...preferences, inAppNotifications: e.target.checked})}
              className="w-5 h-5 text-green-600 rounded"
            />
          </label>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-orange-600" />
            Email Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New Orders</p>
                <p className="text-xs text-gray-500">Get notified when you receive a new order</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNewOrder}
                onChange={(e) => setPreferences({...preferences, emailNewOrder: e.target.checked})}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New Reviews</p>
                <p className="text-xs text-gray-500">Get notified when customers leave reviews</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNewReview}
                onChange={(e) => setPreferences({...preferences, emailNewReview: e.target.checked})}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Payment Notifications</p>
                <p className="text-xs text-gray-500">Get notified about payments and payouts</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailPayment}
                onChange={(e) => setPreferences({...preferences, emailPayment: e.target.checked})}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Notifications</p>
                <p className="text-xs text-gray-500">Important platform updates and announcements</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailSystem}
                onChange={(e) => setPreferences({...preferences, emailSystem: e.target.checked})}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};