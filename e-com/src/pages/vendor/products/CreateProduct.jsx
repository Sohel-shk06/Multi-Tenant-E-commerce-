import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createVendorProduct } from '../../../app/store/vendorProductSlice';
import { vendorService } from '../../../services/vendor.service';
import { categoryService } from '../../../services/category.service';
import { ArrowLeft, Plus, X, Store, RefreshCw } from 'lucide-react';

export const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  });
  
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Direct API calls (no Redux dependency)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading stores and categories...');
      
      // Fetch stores
      const storesData = await vendorService.getVendorStores();
      console.log('✅ Stores loaded:', storesData);
      setStores(storesData || []);
      
      // Fetch categories
      const categoriesData = await categoryService.getCategories();
      console.log('✅ Categories loaded:', categoriesData);
      setCategories(categoriesData || []);
      
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setLocalError('Failed to load stores or categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
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

    const productData = {
      ...formData,
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice) || 0,
      stock: Number(formData.stock) || 0,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      variants: formData.variants.filter(v => v.name && v.value),
    };

    setIsSubmitting(true);
    const resultAction = await dispatch(createVendorProduct(productData));
    setIsSubmitting(false);

    if (resultAction.type === 'vendorProducts/create/fulfilled') {
      navigate('/vendor/products');
    } else {
      setLocalError(resultAction.payload || 'Failed to create product');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores and categories...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
          <button
            onClick={loadData}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {localError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{localError}</div>}

        {/* ✅ STORE STATUS */}
        {stores.length === 0 ? (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Store className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">No Store Found</p>
                <p className="text-sm text-orange-700 mt-1">
                  Product create karne ke liye aapke paas kam se kam ek store hona zaroori hai.
                </p>
                <Link 
                  to="/vendor/stores/create" 
                  className="inline-block mt-3 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                >
                  + Create Your First Store
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <Store className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              ✅ {stores.length} store{stores.length > 1 ? 's' : ''} available
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Wireless Bluetooth Headphones" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Detailed product description..." />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., WBH-001" />
              </div>
            </div>
          </div>

          {/* Category & Store */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required disabled={categories.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {categories.length === 0 && <p className="text-xs text-gray-500 mt-1">No categories available.</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
                <select name="store" value={formData.store} onChange={handleChange} required disabled={stores.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Select your store</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                {stores.length === 0 && <p className="text-xs text-orange-600 mt-1">⚠️ Please create a store first.</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., electronics, audio, wireless" />
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
            <button type="submit" disabled={isSubmitting || stores.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Creating...' : 'Create Product'}
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