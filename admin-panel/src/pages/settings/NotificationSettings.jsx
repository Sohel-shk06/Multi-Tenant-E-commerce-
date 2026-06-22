import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Bell } from 'lucide-react';

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNewOrder: true,
    emailOrderShipped: true,
    emailOrderDelivered: true,
    emailNewReview: true,
    emailNewVendor: true,
    inAppNotifications: true,
    pushNotifications: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('notification');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingService.updateSettings('notification', settings);
      setSuccess('✅ Notification settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div></div>;

  const notifications = [
    { key: 'emailNewOrder', label: 'New Order Placed', desc: 'Notify when a customer places a new order' },
    { key: 'emailOrderShipped', label: 'Order Shipped', desc: 'Notify when an order is shipped' },
    { key: 'emailOrderDelivered', label: 'Order Delivered', desc: 'Notify when an order is delivered' },
    { key: 'emailNewReview', label: 'New Review', desc: 'Notify when a customer writes a review' },
    { key: 'emailNewVendor', label: 'New Vendor Registration', desc: 'Notify when a new vendor registers' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-yellow-600" />
          Notification Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure which notifications to send.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-500">{notif.desc}</p>
                </div>
                <input type="checkbox" checked={settings[notif.key]}
                  onChange={(e) => setSettings({...settings, [notif.key]: e.target.checked})}
                  className="w-5 h-5 text-yellow-600 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">In-App & Push Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">In-App Notifications</p>
                <p className="text-xs text-gray-500">Show notifications inside the platform</p>
              </div>
              <input type="checkbox" checked={settings.inAppNotifications}
                onChange={(e) => setSettings({...settings, inAppNotifications: e.target.checked})}
                className="w-5 h-5 text-yellow-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Browser push notifications</p>
              </div>
              <input type="checkbox" checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                className="w-5 h-5 text-yellow-600 rounded" />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};