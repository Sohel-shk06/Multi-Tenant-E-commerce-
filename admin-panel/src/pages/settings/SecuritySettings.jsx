import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Shield, Lock, Key } from 'lucide-react';

export const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    jwtExpiry: '7d',
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: false,
    twoFactorAuth: false,
    loginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('security');
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
      await settingService.updateSettings('security', settings);
      setSuccess('✅ Security settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-red-600" />
          Security Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure authentication and security policies.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* JWT & Session */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Key className="w-5 h-5 mr-2 text-blue-600" />
            Authentication & Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JWT Token Expiry</label>
              <select value={settings.jwtExpiry} onChange={(e) => setSettings({...settings, jwtExpiry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
              <input type="number" value={settings.loginAttempts} onChange={(e) => setSettings({...settings, loginAttempts: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Duration (minutes)</label>
              <input type="number" value={settings.lockoutDuration} onChange={(e) => setSettings({...settings, lockoutDuration: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={settings.twoFactorAuth} onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Enable Two-Factor Authentication (2FA)</span>
            </label>
          </div>
        </div>

        {/* Password Policy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-600" />
            Password Policy
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
              <input type="number" min="6" max="32" value={settings.passwordMinLength} onChange={(e) => setSettings({...settings, passwordMinLength: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.requireUppercase} onChange={(e) => setSettings({...settings, requireUppercase: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Require at least one uppercase letter</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.requireNumber} onChange={(e) => setSettings({...settings, requireNumber: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Require at least one number</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.requireSpecialChar} onChange={(e) => setSettings({...settings, requireSpecialChar: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Require at least one special character (!@#$)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};