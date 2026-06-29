import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchVendorStore, updateVendorStore } from '../../../app/store/vendorStoreSlice';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export const EditStore = () => {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStore, isLoading, error } = useSelector((state) => state.vendorStores);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    settings: {
      currency: 'INR',
      contactEmail: '',
      contactPhone: '',
      returnPolicy: '7 days return policy'
    }
  });
  
  // ✅ NEW: Image states
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchVendorStore(storeId));
  }, [dispatch, storeId]);

  useEffect(() => {
    if (currentStore) {
      setFormData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        status: currentStore.status || 'active',
        settings: {
          currency: currentStore.settings?.currency || 'INR',
          contactEmail: currentStore.settings?.contactEmail || '',
          contactPhone: currentStore.settings?.contactPhone || '',
          returnPolicy: currentStore.settings?.returnPolicy || '7 days return policy'
        }
      });
      
      // ✅ Set existing images
      if (currentStore.logo) {
        setLogoPreview(currentStore.logo);
      }
      if (currentStore.banner) {
        setBannerPreview(currentStore.banner);
      }
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
    setSuccessMessage('');
  };

  // ✅ NEW: Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Logo size must be less than 5MB');
        return;
      }
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ NEW: Handle banner upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Banner size must be less than 5MB');
        return;
      }
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // ✅ NEW: Remove images (reset to existing)
  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(currentStore?.logo || '');
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(currentStore?.banner || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      return setLocalError('Store name is required');
    }

    setIsSubmitting(true);
    
    // ✅ NEW: Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('status', formData.status);
    formDataToSend.append('settings', JSON.stringify(formData.settings));
    
    // Append new images if selected
    if (logo) formDataToSend.append('logo', logo);
    if (banner) formDataToSend.append('banner', banner);

    const resultAction = await dispatch(updateVendorStore({ 
      storeId, 
      storeData: formDataToSend 
    }));
    setIsSubmitting(false);

    if (resultAction.type === 'vendorStores/update/fulfilled') {
      setSuccessMessage('Store updated successfully!');
      setTimeout(() => navigate('/vendor/stores'), 1500);
    } else {
      setLocalError(resultAction.payload || 'Failed to update store');
    }
  };

  if (isLoading && !currentStore) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/vendor/stores')} 
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Stores</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Store</h1>
        <p className="text-sm text-gray-500 mb-6">Update your store information and settings.</p>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {localError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className={labelClass}>Store Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
              {currentStore && (
                <p className="text-xs text-gray-500 mt-1">
                  Current slug: <span className="font-mono">/{currentStore.slug}</span>
                  {formData.name !== currentStore.name && (
                    <span className="text-orange-600 ml-2">
                      (New slug will be auto-generated)
                    </span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} bg-white`}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* ✅ NEW: Images Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Images</h2>
            
            {/* Logo Upload */}
            <div>
              <label className={labelClass}>Store Logo</label>
              <div className="flex items-start gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      title="Remove logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className={labelClass}>Store Banner</label>
              {bannerPreview ? (
                <div className="relative">
                  <img 
                    src={bannerPreview} 
                    alt="Banner preview" 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    title="Remove banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload banner</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB (Recommended: 1200x400px)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Currency</label>
                <select
                  name="settings.currency"
                  value={formData.settings.currency}
                  onChange={handleChange}
                  className={`${inputClass} bg-white`}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Return Policy</label>
                <input
                  type="text"
                  name="settings.returnPolicy"
                  value={formData.settings.returnPolicy}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  name="settings.contactEmail"
                  value={formData.settings.contactEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Phone</label>
                <input
                  type="text"
                  name="settings.contactPhone"
                  value={formData.settings.contactPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-6 border-t">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/vendor/stores')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};