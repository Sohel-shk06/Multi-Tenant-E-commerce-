import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStore } from '../../app/store/storeSlice';
import { fetchVendors } from '../../app/store/vendorSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const CreateStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vendors } = useSelector((state) => state.vendors);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vendor: '',
    status: 'active',
    settings: {
      currency: 'INR',
      contactEmail: '',
      contactPhone: '',
      returnPolicy: '7 days return policy'
    }
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [dispatch, user]);

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
    if (user?.role === 'admin' && !formData.vendor) {
      setLocalError('Please select a vendor for this store');
      return;
    }

    const storeData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    const resultAction = await dispatch(createStore(storeData));
    if (resultAction.type === 'stores/createStore/fulfilled') {
      navigate('/admin/stores');
    } else {
      setLocalError(resultAction.payload || 'Failed to create store');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate('/admin/stores')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Stores</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Store</h1>

        {localError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{localError}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {user?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor *</label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">-- Select a Vendor --</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Store Name *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., TechStore Pro Official"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the store..."
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
              placeholder="INR"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              name="settings.contactEmail"
              value={formData.settings.contactEmail}
              onChange={handleChange}
              placeholder="store@example.com"
            />
            <Input
              label="Contact Phone"
              type="text"
              name="settings.contactPhone"
              value={formData.settings.contactPhone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">Create Store</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/stores')} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};