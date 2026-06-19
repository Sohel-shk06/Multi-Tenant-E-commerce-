import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchVendorProduct, updateVendorProduct } from '../../../app/store/vendorProductSlice';
import { vendorService } from '../../../services/vendor.service';
import { categoryService } from '../../../services/category.service';
import { ArrowLeft, Plus, X, Store, RefreshCw, Upload, Image as ImageIcon, Save } from 'lucide-react';

export const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    store: '',
    stock: '',
    sku: '',
    tags: '',
    variants: [],
    status: 'draft',
    images: [], // NEW File objects
  });
  
  const [imagePreviews, setImagePreviews] = useState([]); // { url, isExisting, file, name }
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_IMAGES = 10;

  useEffect(() => {
    loadInitialData();
    loadProductData();
  }, [productId]);

  const loadInitialData = async () => {
    try {
      const [storesData, categoriesData] = await Promise.all([
        vendorService.getVendorStores(),
        categoryService.getCategories()
      ]);
      setStores(storesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      setLocalError('Failed to load stores or categories');
    }
  };

  const loadProductData = async () => {
    setLoadingProduct(true);
    try {
      const product = await vendorService.getVendorProduct(productId);
      
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        category: product.category?._id || product.category || '',
        store: product.store?._id || product.store || '',
        stock: product.stock || '',
        sku: product.sku || '',
        tags: product.tags?.join(', ') || '',
        variants: product.variants || [],
        status: product.status || 'draft',
        images: [],
      });

      // Existing images ko previews mein add karein
      if (product.images && product.images.length > 0) {
        setImagePreviews(
          product.images.map(img => ({
            url: img.url,
            isExisting: true,
            publicId: img.publicId,
            isPrimary: img.isPrimary || false
          }))
        );
      }
    } catch (error) {
      console.error('❌ Error loading product:', error);
      setLocalError('Failed to load product details');
    } finally {
      setLoadingProduct(false);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  // ✅ Image handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > MAX_IMAGES) {
      setLocalError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError(`File "${file.name}" is too large. Max 5MB`);
        return;
      }
    }

    // Add new images
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ([
          ...prev,
          { url: reader.result, isExisting: false, file, name: file.name }
        ]));
      };
      reader.readAsDataURL(file);
    });

    setLocalError('');
    e.target.value = '';
  };

  const removeImage = (index) => {
    const image = imagePreviews[index];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Agar naya image tha, toh formData se bhi remove karein
    if (!image.isExisting) {
      const newImages = newPreviews.filter(p => !p.isExisting).map(p => p.file);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', value: '', price: 0, stock: 0 }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError('');

  if (!formData.title.trim()) return setLocalError('Product title is required');
  if (!formData.price || formData.price <= 0) return setLocalError('Valid price is required');
  if (!formData.category) return setLocalError('Category is required');
  if (!formData.store) return setLocalError('Store is required');

  // ✅ Existing images ko alag karein (jo vendor ne rakhi hain)
  const existingImages = imagePreviews
    .filter(img => img.isExisting)
    .map(img => ({
      url: img.url,
      publicId: img.publicId,
      isPrimary: img.isPrimary || false
    }));

  // ✅ FIX: formData.images use karein (ismein File objects hain)
  // ❌ images: [] mat rakho - yeh sab kha raha tha!
  const productData = {
    ...formData,
    price: Number(formData.price),
    comparePrice: Number(formData.comparePrice) || 0,
    stock: Number(formData.stock) || 0,
    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    variants: formData.variants.filter(v => v.name && v.value),
    existingImages,  // ✅ Existing images (jo vendor ne rakhi hain)
    images: formData.images,  // ✅ NEW: formData.images use karein (File objects)
  };

  console.log('📤 Submitting product data:', {
    existingImages: existingImages.length,
    newImages: formData.images.length,
    totalWillBe: existingImages.length + formData.images.length
  });

  setIsSubmitting(true);
  const resultAction = await dispatch(updateVendorProduct({ productId, productData }));
  setIsSubmitting(false);

  if (resultAction.type === 'vendorProducts/update/fulfilled') {
    alert('✅ Product updated successfully!');
    navigate('/vendor/products');
  } else {
    setLocalError(resultAction.payload || 'Failed to update product');
  }
};

  if (loading || loadingProduct) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/vendor/products')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <button
            onClick={loadProductData}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {localError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{localError}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ✅ Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                Product Images
              </h2>
              <span className="text-sm text-gray-500">
                {imagePreviews.length} / {MAX_IMAGES} images
              </span>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Add more images or replace existing
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  PNG, JPG, WEBP up to 5MB each
                </p>
                <label className="cursor-pointer px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={imagePreviews.length >= MAX_IMAGES}
                  />
                  Add Images
                </label>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img src={img.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      {img.isExisting && (
                        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Existing
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {img.name || (img.isExisting ? 'Existing image' : `Image ${index + 1}`)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (₹)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} min="0" step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>

          {/* Category & Store */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
                <select name="store" value={formData.store} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Select your store</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Status (Edit mode only) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Status</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Variants (Optional)</h2>
              <button type="button" onClick={addVariant} className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Variant</span>
              </button>
            </div>
            {formData.variants.length > 0 ? (
              formData.variants.map((variant, index) => (
                <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., Size" />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                    <input type="text" value={variant.value} onChange={(e) => updateVariant(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., XL" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" value={variant.price} onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" min="0" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" min="0" />
                  </div>
                  <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No variants added.</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex space-x-3 pt-6 border-t">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Update Product'}</span>
            </button>
            <button type="button" onClick={() => navigate('/vendor/products')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};