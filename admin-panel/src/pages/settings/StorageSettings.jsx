import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Cloud } from 'lucide-react';

export const StorageSettings = () => {
  const [settings, setSettings] = useState({
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    maxImageSize: 5,
    maxImagesPerProduct: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('storage');
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
      await settingService.updateSettings('storage', settings);
      setSuccess('✅ Storage settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Cloud className="w-6 h-6 mr-2 text-cyan-600" />
          Storage Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure Cloudinary and file upload limits.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cloudinary Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Name</label>
              <input type="text" value={settings.cloudinaryCloudName}
                onChange={(e) => setSettings({...settings, cloudinaryCloudName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input type="text" value={settings.cloudinaryApiKey}
                onChange={(e) => setSettings({...settings, cloudinaryApiKey: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
              <input type="password" value={settings.cloudinaryApiSecret}
                onChange={(e) => setSettings({...settings, cloudinaryApiSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Image Size (MB)</label>
              <input type="number" min="1" max="20" value={settings.maxImageSize}
                onChange={(e) => setSettings({...settings, maxImageSize: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Images Per Product</label>
              <input type="number" min="1" max="50" value={settings.maxImagesPerProduct}
                onChange={(e) => setSettings({...settings, maxImagesPerProduct: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};