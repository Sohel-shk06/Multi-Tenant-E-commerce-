import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStore, updateStore } from '../../app/store/storeSlice';
import { ArrowLeft, Save, Settings } from 'lucide-react';

export const StoreSettings = () => {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStore: store, isLoading } = useSelector((state) => state.stores);
  
  const [settings, setSettings] = useState({
    currency: 'INR',
    contactEmail: '',
    contactPhone: '',
    address: '',
    returnPolicy: '7 days return policy',
    shippingPolicy: '',
    privacyPolicy: '',
    termsOfService: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchStore(storeId));
  }, [dispatch, storeId]);

  useEffect(() => {
    if (store?.settings) {
      setSettings({
        currency: store.settings.currency || 'INR',
        contactEmail: store.settings.contactEmail || '',
        contactPhone: store.settings.contactPhone || '',
        address: store.settings.address || '',
        returnPolicy: store.settings.returnPolicy || '',
        shippingPolicy: store.settings.shippingPolicy || '',
        privacyPolicy: store.settings.privacyPolicy || '',
        termsOfService: store.settings.termsOfService || ''
      });
    }
  }, [store]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateStore({ 
        storeId, 
        storeData: { settings } 
      })).unwrap();
      setSuccess('✅ Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !store) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-gray-600" />
          {store.name} - Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure store policies and contact information.</p>
      </div>

      {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input type="text" value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Store Policies</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
              <textarea value={settings.returnPolicy}
                onChange={(e) => setSettings({...settings, returnPolicy: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
              <textarea value={settings.shippingPolicy}
                onChange={(e) => setSettings({...settings, shippingPolicy: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy</label>
              <textarea value={settings.privacyPolicy}
                onChange={(e) => setSettings({...settings, privacyPolicy: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms of Service</label>
              <textarea value={settings.termsOfService}
                onChange={(e) => setSettings({...settings, termsOfService: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};