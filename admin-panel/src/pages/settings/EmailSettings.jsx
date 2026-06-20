import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Mail, Send } from 'lucide-react';

export const EmailSettings = () => {
  const [settings, setSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromEmail: 'noreply@marketplace.com',
    fromName: 'Marketplace'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('email');
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
      await settingService.updateSettings('email', settings);
      setSuccess('✅ Email settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-orange-600" />
          Email Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure SMTP settings for transactional emails.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input type="text" placeholder="smtp.gmail.com" value={settings.smtpHost}
              onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
            <input type="number" value={settings.smtpPort}
              onChange={(e) => setSettings({...settings, smtpPort: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="flex items-center space-x-2 mt-7">
              <input type="checkbox" checked={settings.smtpSecure}
                onChange={(e) => setSettings({...settings, smtpSecure: e.target.checked})}
                className="w-4 h-4 text-orange-600 rounded" />
              <span className="text-sm text-gray-700">Use SSL/TLS</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
            <input type="text" value={settings.smtpUser}
              onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input type="password" value={settings.smtpPassword}
              onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
            <input type="email" value={settings.fromEmail}
              onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
            <input type="text" value={settings.fromName}
              onChange={(e) => setSettings({...settings, fromName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};