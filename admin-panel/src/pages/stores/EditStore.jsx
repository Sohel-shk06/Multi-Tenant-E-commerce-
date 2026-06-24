import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStore, updateStore } from '../../app/store/storeSlice';
import { fetchVendors } from '../../app/store/vendorSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EditStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { user } = useAuth();
  const { vendors } = useSelector((state) => state.vendors);
  const { currentStore, isLoading } = useSelector((state) => state.stores);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vendor: '',
    status: 'active',
    settings: {
      currency: 'INR',
      contactEmail: '',
      contactPhone: '',
      returnPolicy: '7 days return policy',
      shippingPolicy: '',
      address: ''
    }
  });
  const [localError, setLocalError] = useState('');
  const [loadingStore, setLoadingStore] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
    loadStore();
  }, [dispatch, storeId]);

  const loadStore = async () => {
    setLoadingStore(true);
    try {
      await dispatch(fetchStore(storeId)).unwrap();
    } catch (err) {
      setLocalError('Failed to load store data');
    } finally {
      setLoadingStore(false);
    }
  };

  useEffect(() => {
    if (currentStore) {
      setFormData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        vendor: currentStore.vendor?._id || currentStore.vendor || '',
        status: currentStore.status || 'active',
        settings: {
          currency: currentStore.settings?.currency || 'INR',
          contactEmail: currentStore.settings?.contactEmail || '',
          contactPhone: currentStore.settings?.contactPhone || '',
          returnPolicy: currentStore.settings?.returnPolicy || '7 days return policy',
          shippingPolicy: currentStore.settings?.shippingPolicy || '',
          address: currentStore.settings?.address || ''
        }
      });
    }
  }, [currentStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('settings.')) {
      const settingKey = name.split('.')[1];
      setFormData({
        ...formData,
        settings: { ...formData.settings, [settingKey]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setLocalError('Store name is required');
      return;
    }

    const resultAction = await dispatch(updateStore({ 
      storeId, 
      storeData: formData 
    }));
    
    if (resultAction.type === 'stores/updateStore/fulfilled') {
      alert('✅ Store updated successfully!');
      navigate('/admin/stores');
    } else {
      setLocalError(resultAction.payload || 'Failed to update store');
    }
  };

  if (loadingStore || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate('/admin/stores')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Stores</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Store</h1>

        {localError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{localError}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {user?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                disabled
              >
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Vendor cannot be changed after store creation</p>
            </div>
          )}

          <Input
            label="Store Name *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Input
              label="Currency"
              type="text"
              name="settings.currency"
              value={formData.settings.currency}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              name="settings.contactEmail"
              value={formData.settings.contactEmail}
              onChange={handleChange}
            />
            <Input
              label="Contact Phone"
              type="text"
              name="settings.contactPhone"
              value={formData.settings.contactPhone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="settings.address"
              value={formData.settings.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
            <textarea
              name="settings.returnPolicy"
              value={formData.settings.returnPolicy}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
            <textarea
              name="settings.shippingPolicy"
              value={formData.settings.shippingPolicy}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Updating...' : 'Update Store'}</span>
              </div>
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/stores')} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};