import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, Percent, DollarSign } from 'lucide-react';

export const CommissionSettings = () => {
  const [settings, setSettings] = useState({
    globalCommissionRate: 10,
    commissionType: 'percentage',
    minimumOrderForCommission: 0,
    autoCollectCommission: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('commission');
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
      await settingService.updateSettings('commission', settings);
      setSuccess('✅ Commission settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Percent className="w-6 h-6 mr-2 text-emerald-600" />
          Commission Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure platform commission rates and policies.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Global Commission Rate (%)</label>
            <div className="relative">
              <input type="number" min="0" max="100" step="0.1" value={settings.globalCommissionRate}
                onChange={(e) => setSettings({...settings, globalCommissionRate: Number(e.target.value)})}
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg" />
              <Percent className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Applied to all vendors by default</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
            <select value={settings.commissionType} onChange={(e) => setSettings({...settings, commissionType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order for Commission (₹)</label>
            <div className="relative">
              <input type="number" min="0" value={settings.minimumOrderForCommission}
                onChange={(e) => setSettings({...settings, minimumOrderForCommission: Number(e.target.value)})}
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg" />
              <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={settings.autoCollectCommission}
              onChange={(e) => setSettings({...settings, autoCollectCommission: e.target.checked})}
              className="w-4 h-4 text-emerald-600 rounded" />
            <span className="text-sm text-gray-700">Auto-collect commission on order completion</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">When enabled, commission will be automatically marked as collected when order is completed</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Example Calculation</h3>
          <p className="text-sm text-blue-800">
            Order Total: ₹1,000 → Commission: <strong>₹{(1000 * settings.globalCommissionRate / 100).toFixed(2)}</strong> → Vendor Receives: <strong>₹{(1000 - (1000 * settings.globalCommissionRate / 100)).toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};