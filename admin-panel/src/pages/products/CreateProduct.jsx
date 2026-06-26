import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProduct } from '../../app/store/productSlice';
import { fetchCategories } from '../../app/store/categorySlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, Plus, X, Save, Edit, Upload, Image as ImageIcon, Package, Tag, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const { user } = useAuth();
  const { categories } = useSelector((state) => state.categories);
  const { vendors } = useSelector((state) => state.vendors);
  const { currentProduct, isLoading } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', comparePrice: '',
    category: '', vendor: '', store: '', stock: '', sku: '',
    tags: '', variants: [], status: 'draft', images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [localError, setLocalError] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const MIN_IMAGES = 3;
  const MAX_IMAGES = 10;

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
    if (isAdmin) {
      import('../../app/store/vendorSlice').then(({ fetchVendors }) => {
        dispatch(fetchVendors({ page: 1, limit: 100 }));
      });
    }
    if (isEditMode) {
      setLoadingProduct(true);
      dispatch(fetchProduct(productId)).unwrap()
        .catch(() => setLocalError('Failed to load product data'))
        .finally(() => setLoadingProduct(false));
    }
  }, [dispatch, isAdmin, productId]);

  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price || '',
        comparePrice: currentProduct.comparePrice || '',
        category: currentProduct.category?._id || currentProduct.category || '',
        vendor: currentProduct.vendor?._id || currentProduct.vendor || '',
        store: currentProduct.store?._id || currentProduct.store || '',
        stock: currentProduct.stock || '',
        sku: currentProduct.sku || '',
        tags: currentProduct.tags?.join(', ') || '',
        variants: currentProduct.variants || [],
        status: currentProduct.status || 'draft',
        images: []
      });
      if (currentProduct.images?.length > 0) {
        setImagePreviews(currentProduct.images.map(img => ({
          url: img.url, isExisting: true, publicId: img.publicId
        })));
      }
    }
  }, [currentProduct, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (imagePreviews.length + files.length > MAX_IMAGES) {
      setLocalError(`Maximum ${MAX_IMAGES} images allowed.`); return;
    }
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) { setLocalError('Only image files allowed'); return; }
      if (file.size > 5 * 1024 * 1024) { setLocalError(`"${file.name}" exceeds 5MB limit`); return; }
      validFiles.push(file);
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, { url: reader.result, isExisting: false, file, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
    setLocalError('');
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = newPreviews.filter(p => !p.isExisting).map(p => p.file);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { name: '', value: '', price: 0, stock: 0 }] });
  };

  const removeVariant = (index) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setLocalError('Product title is required'); return; }
    if (!formData.price || formData.price <= 0) { setLocalError('Valid price is required'); return; }
    if (!formData.category) { setLocalError('Category is required'); return; }
    if (isAdmin && !formData.vendor) { setLocalError('Please select a vendor'); return; }

    const totalImages = formData.images.length + imagePreviews.filter(p => p.isExisting).length;
    if (!isEditMode && totalImages < MIN_IMAGES) {
      setLocalError(`At least ${MIN_IMAGES} images required. You have ${totalImages}.`); return;
    }

    const existingImages = isEditMode
      ? imagePreviews.filter(img => img.isExisting).map(img => ({ url: img.url, publicId: img.publicId, isPrimary: false }))
      : [];

    const productData = {
      ...formData,
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice) || 0,
      stock: Number(formData.stock) || 0,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      variants: formData.variants.filter(v => v.name && v.value),
      existingImages,
    };
    if (!isAdmin) delete productData.vendor;

    setIsSubmitting(true);
    const resultAction = isEditMode
      ? await dispatch(updateProduct({ productId, productData }))
      : await dispatch(createProduct(productData));
    setIsSubmitting(false);

    if (resultAction.type.endsWith('/fulfilled')) {
      navigate('/admin/products');
    } else {
      setLocalError(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    }
  };

  if (isEditMode && loadingProduct) return <PageLoader />;

  const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {isEditMode ? 'Update product details' : 'Add a new product to the catalog'}
          </p>
        </div>
      </div>

      {localError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Vendor Assignment (Admin only) */}
        {isAdmin && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                <Package className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Vendor Assignment</p>
            </div>
            <div className="p-5">
              <label className={labelClass}>Select Vendor *</label>
              <select name="vendor" value={formData.vendor} onChange={handleChange} className={inputClass} required={isAdmin}>
                <option value="">— Select a Vendor —</option>
                {vendors && vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                <ImageIcon className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Product Images</p>
            </div>
            <span className="text-[11px] text-gray-400">
              {imagePreviews.length}/{MAX_IMAGES}
              {!isEditMode && <span className="text-red-500 ml-1">(min {MIN_IMAGES})</span>}
            </span>
          </div>
          <div className="p-5 space-y-4">

            {/* Upload area */}
            <label
              className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors"
              style={{ backgroundColor: imagePreviews.length >= MAX_IMAGES ? '#F9FAFB' : '#FAFBFF' }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={imagePreviews.length >= MAX_IMAGES}
              />
              <Upload className="w-8 h-8 mb-2" style={{ color: '#818CF8' }} />
              <p className="text-[13px] font-medium text-gray-700">Click to upload images</p>
              <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
            </label>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={img.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    {index === 0 && (
                      <span
                        className="absolute top-1 left-1 text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: '#15803D' }}
                      >
                        Primary
                      </span>
                    )}
                    {img.isExisting && (
                      <span
                        className="absolute top-1 right-1 text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: '#4338CA' }}
                      >
                        Saved
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Package className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Basic Information</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className={labelClass}>Product Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Wireless Bluetooth Headphones" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Detailed product description..." className={inputClass} style={{ resize: 'none' }} required />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <DollarSign className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Pricing & Inventory</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Compare Price (₹)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} min="0" step="0.01" placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g., WBH-001" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Tag className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Classification</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass} required>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., electronics, audio" className={inputClass} />
              </div>
            </div>
            {isEditMode && (
              <div className="mt-4">
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                <Plus className="w-4 h-4" style={{ color: '#4338CA' }} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900">Variants (Optional)</p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors"
              style={{ color: '#4338CA' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>
          <div className="p-5">
            {formData.variants.length > 0 ? (
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1 min-w-[100px]">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Name</label>
                      <input type="text" value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)} className={inputClass} placeholder="e.g., Size" />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Value</label>
                      <input type="text" value={variant.value} onChange={(e) => updateVariant(index, 'value', e.target.value)} className={inputClass} placeholder="e.g., XL" />
                    </div>
                    <div className="w-24">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Price</label>
                      <input type="number" value={variant.price} onChange={(e) => updateVariant(index, 'price', Number(e.target.value))} className={inputClass} min="0" />
                    </div>
                    <div className="w-24">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Stock</label>
                      <input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))} className={inputClass} min="0" />
                    </div>
                    <button type="button" onClick={() => removeVariant(index)} className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-red-100 hover:bg-red-50 text-red-500 transition-colors mb-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 italic">No variants added yet.</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4338CA' }}
            onMouseEnter={e => !(isSubmitting || isLoading) && (e.currentTarget.style.backgroundColor = '#312E81')}
            onMouseLeave={e => !(isSubmitting || isLoading) && (e.currentTarget.style.backgroundColor = '#4338CA')}
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting || isLoading
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Product' : 'Create Product')
            }
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};