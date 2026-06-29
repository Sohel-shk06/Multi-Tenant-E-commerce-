// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { createStore } from '../../app/store/storeSlice';
// import { fetchVendors } from '../../app/store/vendorSlice';
// import { ArrowLeft, Store, Mail, Phone, DollarSign } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// export const CreateStore = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { vendors } = useSelector((state) => state.vendors);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     vendor: '',
//     status: 'active',
//     settings: {
//       currency: 'INR',
//       contactEmail: '',
//       contactPhone: '',
//       returnPolicy: '7 days return policy'
//     }
//   });
//   const [localError, setLocalError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (user?.role === 'admin') {
//       dispatch(fetchVendors({ page: 1, limit: 100 }));
//     }
//   }, [dispatch, user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('settings.')) {
//       const settingKey = name.split('.')[1];
//       setFormData({ ...formData, settings: { ...formData.settings, [settingKey]: value } });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//     setLocalError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) { setLocalError('Store name is required'); return; }
//     if (user?.role === 'admin' && !formData.vendor) { setLocalError('Please select a vendor'); return; }

//     setIsSubmitting(true);
//     const storeData = { ...formData, name: formData.name.trim(), description: formData.description.trim() };
//     const resultAction = await dispatch(createStore(storeData));
//     setIsSubmitting(false);

//     if (resultAction.type === 'stores/createStore/fulfilled') {
//       navigate('/admin/stores');
//     } else {
//       setLocalError(resultAction.payload || 'Failed to create store');
//     }
//   };

//   const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
//   const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

//   return (
//     <div className="p-6 max-w-2xl mx-auto space-y-5">

//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={() => navigate('/admin/stores')}
//           className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 text-gray-600" />
//         </button>
//         <div>
//           <h1 className="text-[18px] font-semibold text-gray-900">Create New Store</h1>
//           <p className="text-[12px] text-gray-400 mt-0.5">Fill in the details to create a new storefront</p>
//         </div>
//       </div>

//       {localError && (
//         <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
//           {localError}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Basic Info */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
//               <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
//             </div>
//             <p className="text-[13px] font-semibold text-gray-900">Basic Information</p>
//           </div>
//           <div className="p-5 space-y-4">

//             {user?.role === 'admin' && (
//               <div>
//                 <label className={labelClass}>Select Vendor *</label>
//                 <select
//                   name="vendor"
//                   value={formData.vendor}
//                   onChange={handleChange}
//                   className={inputClass}
//                   required
//                 >
//                   <option value="">— Select a Vendor —</option>
//                   {vendors.map((v) => (
//                     <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <div>
//               <label className={labelClass}>Store Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., TechStore Pro Official"
//                 className={inputClass}
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="3"
//                 placeholder="Brief description of the store..."
//                 className={inputClass}
//                 style={{ resize: 'none' }}
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="active">Active</option>
//                 <option value="paused">Paused</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>

//           </div>
//         </div>

//         {/* Settings */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
//               <DollarSign className="w-4 h-4" style={{ color: '#4338CA' }} />
//             </div>
//             <p className="text-[13px] font-semibold text-gray-900">Store Settings</p>
//           </div>
//           <div className="p-5 space-y-4">

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>Currency</label>
//                 <input
//                   type="text"
//                   name="settings.currency"
//                   value={formData.settings.currency}
//                   onChange={handleChange}
//                   placeholder="INR"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Return Policy</label>
//                 <input
//                   type="text"
//                   name="settings.returnPolicy"
//                   value={formData.settings.returnPolicy}
//                   onChange={handleChange}
//                   placeholder="7 days return policy"
//                   className={inputClass}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>Contact Email</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                   <input
//                     type="email"
//                     name="settings.contactEmail"
//                     value={formData.settings.contactEmail}
//                     onChange={handleChange}
//                     placeholder="store@example.com"
//                     className={`${inputClass} pl-9`}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Contact Phone</label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="settings.contactPhone"
//                     value={formData.settings.contactPhone}
//                     onChange={handleChange}
//                     placeholder="+91 9876543210"
//                     className={`${inputClass} pl-9`}
//                   />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
//             style={{ backgroundColor: '#4338CA' }}
//             onMouseEnter={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#312E81')}
//             onMouseLeave={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4338CA')}
//           >
//             {isSubmitting ? 'Creating...' : 'Create Store'}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/admin/stores')}
//             className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };




import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStore } from '../../app/store/storeSlice';
import { fetchVendors } from '../../app/store/vendorSlice';
import { ArrowLeft, Store, Mail, Phone, DollarSign, Upload, X, Image as ImageIcon } from 'lucide-react';
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
    },
    logo: null,
    banner: null
  });
  
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('settings.')) {
      const settingKey = name.split('.')[1];
      setFormData({ ...formData, settings: { ...formData.settings, [settingKey]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setLocalError('');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed for Logo');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Logo size cannot exceed 5MB');
        return;
      }
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLocalError('');
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed for Banner');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Banner size cannot exceed 5MB');
        return;
      }
      setFormData({ ...formData, banner: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLocalError('');
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo: null });
    setLogoPreview('');
  };

  const removeBanner = () => {
    setFormData({ ...formData, banner: null });
    setBannerPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setLocalError('Store name is required'); return; }
    if (user?.role === 'admin' && !formData.vendor) { setLocalError('Please select a vendor'); return; }

    setIsSubmitting(true);
    const storeData = { 
      ...formData, 
      name: formData.name.trim(), 
      description: formData.description.trim() 
    };
    const resultAction = await dispatch(createStore(storeData));
    setIsSubmitting(false);

    if (resultAction.type === 'stores/createStore/fulfilled') {
      navigate('/admin/stores');
    } else {
      setLocalError(resultAction.payload || 'Failed to create store');
    }
  };

  const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/stores')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Create New Store</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Fill in the details to create a new storefront</p>
        </div>
      </div>

      {localError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Store className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Basic Information</p>
          </div>
          <div className="p-5 space-y-4">
            {user?.role === 'admin' && (
              <div>
                <label className={labelClass}>Select Vendor *</label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">— Select a Vendor —</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                  ))}
                </select>
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
                placeholder="e.g., TechStore Pro Official"
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
                placeholder="Brief description of the store..."
                className={inputClass}
                style={{ resize: 'none' }}
              />
            </div>

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
          </div>
        </div>

        {/* ✅ NEW: Images Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Upload className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Store Images</p>
          </div>
          <div className="p-5 space-y-4">
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
          </div>
        </div>

        {/* Store Branding */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <ImageIcon className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Store Branding</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Logo Upload */}
              <div className="sm:col-span-1 flex flex-col items-center">
                <label className="block text-[12px] font-medium text-gray-600 mb-1.5 self-start">Store Logo</label>
                <div className="relative group w-28 h-28 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-colors">
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                        title="Remove Logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center">
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-[11px] font-semibold text-gray-500">Upload Logo</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">1:1 Ratio</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Banner Upload */}
              <div className="sm:col-span-2 flex flex-col">
                <label className="block text-[12px] font-medium text-gray-600 mb-1.5">Store Banner</label>
                <div className="relative group w-full h-28 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-colors">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeBanner}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                        title="Remove Banner"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-[11px] font-semibold text-gray-500">Upload Banner Image</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">Recommended 1200x400 px</span>
                      <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <DollarSign className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Store Settings</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Currency</label>
                <input
                  type="text"
                  name="settings.currency"
                  value={formData.settings.currency}
                  onChange={handleChange}
                  placeholder="INR"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Return Policy</label>
                <input
                  type="text"
                  name="settings.returnPolicy"
                  value={formData.settings.returnPolicy}
                  onChange={handleChange}
                  placeholder="7 days return policy"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="email"
                    name="settings.contactEmail"
                    value={formData.settings.contactEmail}
                    onChange={handleChange}
                    placeholder="store@example.com"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="settings.contactPhone"
                    value={formData.settings.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4338CA' }}
            onMouseEnter={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#312E81')}
            onMouseLeave={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4338CA')}
          >
            {isSubmitting ? 'Creating...' : 'Create Store'}
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
  );
};