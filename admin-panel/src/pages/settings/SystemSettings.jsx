import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Settings, AlertTriangle } from 'lucide-react';

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'We are currently under maintenance. Please check back later.',
    registrationEnabled: true,
    vendorRegistrationEnabled: true,
    autoApproveVendors: false,
    autoApproveProducts: false,
    cacheEnabled: true,
    debugMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('system');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (settings.maintenanceMode && !window.confirm('⚠️ Enable maintenance mode? This will make the site unavailable to users.')) {
      return;
    }
    setSaving(true);
    try {
      await settingService.updateSettings('system', settings);
      setSuccess('✅ System settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-gray-600" />
          System Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure platform-wide system settings.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Maintenance Mode */}
        {settings.maintenanceMode && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Maintenance Mode Active</p>
              <p className="text-sm text-red-700">The platform is currently unavailable to users.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Maintenance</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Disable public access to the platform</p>
              </div>
              <input type="checkbox" checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="w-5 h-5 text-red-600 rounded" />
            </label>
            {settings.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                <textarea value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Registration</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Customer Registration</p>
                <p className="text-xs text-gray-500">Allow new customers to sign up</p>
              </div>
              <input type="checkbox" checked={settings.registrationEnabled}
                onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Vendor Registration</p>
                <p className="text-xs text-gray-500">Allow new vendors to sign up</p>
              </div>
              <input type="checkbox" checked={settings.vendorRegistrationEnabled}
                onChange={(e) => setSettings({...settings, vendorRegistrationEnabled: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-Approve Vendors</p>
                <p className="text-xs text-gray-500">Skip admin approval for new vendors</p>
              </div>
              <input type="checkbox" checked={settings.autoApproveVendors}
                onChange={(e) => setSettings({...settings, autoApproveVendors: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-Approve Products</p>
                <p className="text-xs text-gray-500">Skip moderation for new products</p>
              </div>
              <input type="checkbox" checked={settings.autoApproveProducts}
                onChange={(e) => setSettings({...settings, autoApproveProducts: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Advanced</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Cache</p>
                <p className="text-xs text-gray-500">Improve performance with caching</p>
              </div>
              <input type="checkbox" checked={settings.cacheEnabled}
                onChange={(e) => setSettings({...settings, cacheEnabled: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Debug Mode</p>
                <p className="text-xs text-gray-500">Show detailed error messages (dev only)</p>
              </div>
              <input type="checkbox" checked={settings.debugMode}
                onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded" />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};