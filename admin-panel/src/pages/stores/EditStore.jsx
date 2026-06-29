// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchStore, updateStore } from '../../app/store/storeSlice';
// import { fetchVendors } from '../../app/store/vendorSlice';
// import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';
// import { ArrowLeft, Save } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// export const EditStore = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { storeId } = useParams();
//   const { user } = useAuth();
//   const { vendors } = useSelector((state) => state.vendors);
//   const { currentStore, isLoading } = useSelector((state) => state.stores);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     vendor: '',
//     status: 'active',
//     settings: {
//       currency: 'INR',
//       contactEmail: '',
//       contactPhone: '',
//       returnPolicy: '7 days return policy',
//       shippingPolicy: '',
//       address: ''
//     }
//   });
//   const [localError, setLocalError] = useState('');
//   const [loadingStore, setLoadingStore] = useState(true);

//   useEffect(() => {
//     if (user?.role === 'admin') {
//       dispatch(fetchVendors({ page: 1, limit: 100 }));
//     }
//     loadStore();
//   }, [dispatch, storeId]);

//   const loadStore = async () => {
//     setLoadingStore(true);
//     try {
//       await dispatch(fetchStore(storeId)).unwrap();
//     } catch (err) {
//       setLocalError('Failed to load store data');
//     } finally {
//       setLoadingStore(false);
//     }
//   };

//   useEffect(() => {
//     if (currentStore) {
//       setFormData({
//         name: currentStore.name || '',
//         description: currentStore.description || '',
//         vendor: currentStore.vendor?._id || currentStore.vendor || '',
//         status: currentStore.status || 'active',
//         settings: {
//           currency: currentStore.settings?.currency || 'INR',
//           contactEmail: currentStore.settings?.contactEmail || '',
//           contactPhone: currentStore.settings?.contactPhone || '',
//           returnPolicy: currentStore.settings?.returnPolicy || '7 days return policy',
//           shippingPolicy: currentStore.settings?.shippingPolicy || '',
//           address: currentStore.settings?.address || ''
//         }
//       });
//     }
//   }, [currentStore]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('settings.')) {
//       const settingKey = name.split('.')[1];
//       setFormData({
//         ...formData,
//         settings: { ...formData.settings, [settingKey]: value }
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//     setLocalError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       setLocalError('Store name is required');
//       return;
//     }

//     const resultAction = await dispatch(updateStore({ 
//       storeId, 
//       storeData: formData 
//     }));
    
//     if (resultAction.type === 'stores/updateStore/fulfilled') {
//       alert('✅ Store updated successfully!');
//       navigate('/admin/stores');
//     } else {
//       setLocalError(resultAction.payload || 'Failed to update store');
//     }
//   };

//   if (loadingStore || isLoading) {
//     return (
//       <div className="p-6 flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <button onClick={() => navigate('/admin/stores')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         <span className="text-sm font-medium">Back to Stores</span>
//       </button>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Store</h1>

//         {localError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{localError}</div>}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {user?.role === 'admin' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
//               <select
//                 name="vendor"
//                 value={formData.vendor}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
//                 disabled
//               >
//                 {vendors.map((v) => (
//                   <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
//                 ))}
//               </select>
//               <p className="text-xs text-gray-500 mt-1">Vendor cannot be changed after store creation</p>
//             </div>
//           )}

//           <Input
//             label="Store Name *"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="active">Active</option>
//                 <option value="paused">Paused</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>
//             <Input
//               label="Currency"
//               type="text"
//               name="settings.currency"
//               value={formData.settings.currency}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Contact Email"
//               type="email"
//               name="settings.contactEmail"
//               value={formData.settings.contactEmail}
//               onChange={handleChange}
//             />
//             <Input
//               label="Contact Phone"
//               type="text"
//               name="settings.contactPhone"
//               value={formData.settings.contactPhone}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <textarea
//               name="settings.address"
//               value={formData.settings.address}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
//             <textarea
//               name="settings.returnPolicy"
//               value={formData.settings.returnPolicy}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
//             <textarea
//               name="settings.shippingPolicy"
//               value={formData.settings.shippingPolicy}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex space-x-3 pt-4 border-t">
//             <Button type="submit" className="flex-1" disabled={isLoading}>
//               <div className="flex items-center space-x-2">
//                 <Save className="w-4 h-4" />
//                 <span>{isLoading ? 'Updating...' : 'Update Store'}</span>
//               </div>
//             </Button>
//             <Button type="button" variant="outline" onClick={() => navigate('/admin/stores')} className="flex-1">Cancel</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };




import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStore, updateStore } from '../../app/store/storeSlice';
import { fetchVendors } from '../../app/store/vendorSlice';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
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
  
  // ✅ NEW: Image states
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
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

  // ✅ NEW: Remove logo
  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(currentStore?.logo || '');
  };

  // ✅ NEW: Remove banner
  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(currentStore?.banner || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setLocalError('Store name is required');
      return;
    }

    // ✅ NEW: Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('status', formData.status);
    formDataToSend.append('settings', JSON.stringify(formData.settings));
    
    // Append images if new ones selected
    if (logo) formDataToSend.append('logo', logo);
    if (banner) formDataToSend.append('banner', banner);

    const resultAction = await dispatch(updateStore({ 
      storeId, 
      storeData: formDataToSend 
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

  const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

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
              <label className={labelClass}>Vendor</label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className={`${inputClass} bg-gray-50 cursor-not-allowed`}
                disabled
              >
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Vendor cannot be changed after store creation</p>
            </div>
          )}

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
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={inputClass}
              style={{ resize: 'none' }}
            />
          </div>

          {/* ✅ NEW: Images Section */}
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
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
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
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <input
                type="text"
                name="settings.currency"
                value={formData.settings.currency}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className={labelClass}>Address</label>
            <textarea
              name="settings.address"
              value={formData.settings.address}
              onChange={handleChange}
              rows="2"
              className={inputClass}
              style={{ resize: 'none' }}
            />
          </div>

          <div>
            <label className={labelClass}>Return Policy</label>
            <textarea
              name="settings.returnPolicy"
              value={formData.settings.returnPolicy}
              onChange={handleChange}
              rows="2"
              className={inputClass}
              style={{ resize: 'none' }}
            />
          </div>

          <div>
            <label className={labelClass}>Shipping Policy</label>
            <textarea
              name="settings.shippingPolicy"
              value={formData.settings.shippingPolicy}
              onChange={handleChange}
              rows="2"
              className={inputClass}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#4338CA' }}
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Updating...' : 'Update Store'}</span>
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/stores')} 
              className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};