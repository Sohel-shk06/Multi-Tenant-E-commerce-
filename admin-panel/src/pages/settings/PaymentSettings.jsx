import { useEffect, useState } from 'react';
import { settingService } from '../../services/setting.service';
import { Save, CreditCard, AlertTriangle } from 'lucide-react';

export const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    stripeEnabled: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    razorpayEnabled: false,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    codEnabled: true,
    minOrderAmount: 100,
    maxOrderAmount: 100000
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingService.getSettingsByCategory('payment');
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
      await settingService.updateSettings('payment', settings);
      setSuccess('✅ Payment settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
          Payment Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure payment gateways and order limits.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Stripe</p>
                  <p className="text-xs text-gray-500">International payments</p>
                </div>
                <input type="checkbox" checked={settings.stripeEnabled}
                  onChange={(e) => setSettings({...settings, stripeEnabled: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded" />
              </label>
              {settings.stripeEnabled && (
                <div className="space-y-3 pt-3 border-t">
                  <input type="text" placeholder="Publishable Key" value={settings.stripePublishableKey}
                    onChange={(e) => setSettings({...settings, stripePublishableKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="password" placeholder="Secret Key" value={settings.stripeSecretKey}
                    onChange={(e) => setSettings({...settings, stripeSecretKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Razorpay</p>
                  <p className="text-xs text-gray-500">India payments</p>
                </div>
                <input type="checkbox" checked={settings.razorpayEnabled}
                  onChange={(e) => setSettings({...settings, razorpayEnabled: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded" />
              </label>
              {settings.razorpayEnabled && (
                <div className="space-y-3 pt-3 border-t">
                  <input type="text" placeholder="Key ID" value={settings.razorpayKeyId}
                    onChange={(e) => setSettings({...settings, razorpayKeyId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="password" placeholder="Key Secret" value={settings.razorpayKeySecret}
                    onChange={(e) => setSettings({...settings, razorpayKeySecret: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                  <p className="text-xs text-gray-500">Pay when delivered</p>
                </div>
                <input type="checkbox" checked={settings.codEnabled}
                  onChange={(e) => setSettings({...settings, codEnabled: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded" />
              </label>
            </div>
          </div>
        </div>

        {/* Order Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
              <input type="number" min="0" value={settings.minOrderAmount}
                onChange={(e) => setSettings({...settings, minOrderAmount: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Order Amount (₹)</label>
              <input type="number" min="0" value={settings.maxOrderAmount}
                onChange={(e) => setSettings({...settings, maxOrderAmount: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};