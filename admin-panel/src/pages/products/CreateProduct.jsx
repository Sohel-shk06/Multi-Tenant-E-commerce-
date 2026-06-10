import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../app/store/productSlice';
import { fetchCategories } from '../../app/store/categorySlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Current user ka role check karne ke liye
  const { categories } = useSelector((state) => state.categories);
  const { vendors } = useSelector((state) => state.vendors); // ✅ Vendors list
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    vendor: '', // ✅ Admin ke liye vendor selection
    store: '',
    stock: '',
    sku: '',
    tags: '',
    variants: []
  });
  
  const [localError, setLocalError] = useState('');

  const isAdmin = user?.role === 'admin';

  // Categories aur Vendors load karein
  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
    if (isAdmin) {
      // Admin ke liye vendors list fetch karein
      import('../../app/store/vendorSlice').then(({ fetchVendors }) => {
        dispatch(fetchVendors({ page: 1, limit: 100 }));
      });
    }
  }, [dispatch, isAdmin]);

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
    
    if (!formData.title.trim()) {
      setLocalError('Product title is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setLocalError('Valid price is required');
      return;
    }
    if (!formData.category) {
      setLocalError('Category is required');
      return;
    }
    // ✅ Admin ke liye vendor selection zaroori hai
    if (isAdmin && !formData.vendor) {
      setLocalError('Please select a vendor for this product');
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice) || 0,
      stock: Number(formData.stock) || 0,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      variants: formData.variants.filter(v => v.name && v.value)
    };

    // ✅ Agar vendor nahi select kiya (Vendor login hai), toh field remove karo
    if (!isAdmin) {
      delete productData.vendor;
    }

    const resultAction = await dispatch(createProduct(productData));
    
    if (resultAction.type === 'products/createProduct/fulfilled') {
      navigate('/admin/products');
    } else {
      setLocalError(resultAction.payload || 'Failed to create product');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h1>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ✅ Admin ke liye Vendor Selection (agar admin hai toh dikhao) */}
          {isAdmin && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Vendor Assignment</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-3">
                  ℹ️ As an admin, you need to assign this product to a vendor.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor *</label>
                  <select
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required={isAdmin}
                  >
                    <option value="">-- Select a Vendor --</option>
                    {vendors && vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <Input
              label="Product Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Wireless Bluetooth Headphones"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed product description..."
                required
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price (₹)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <Input
                label="Compare Price (₹) - Optional"
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <Input
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

              <Input
                label="SKU"
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., WBH-001"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Tags (comma separated)"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., electronics, audio, wireless"
              />
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Variants (Optional)</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Variant</span>
              </button>
            </div>

            {formData.variants.length > 0 ? (
              formData.variants.map((variant, index) => (
                <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g., Size"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      value={variant.value}
                      onChange={(e) => updateVariant(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g., XL"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors mb-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No variants added yet.</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-6 border-t">
            <Button type="submit" className="flex-1">
              Create Product
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};