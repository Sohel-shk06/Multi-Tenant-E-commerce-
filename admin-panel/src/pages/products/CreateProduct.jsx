// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { createProduct, updateProduct, fetchProduct } from '../../app/store/productSlice';
// import { fetchCategories } from '../../app/store/categorySlice';
// import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';
// import { PageLoader } from '../../components/loaders/PageLoader';
// import { ArrowLeft, Plus, X, Save, Edit } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// export const CreateProduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { productId } = useParams(); // ✅ URL se productId milega agar edit mode hai
//   const isEditMode = Boolean(productId); // ✅ Edit mode detect karein
  
//   const { user } = useAuth();
//   const { categories } = useSelector((state) => state.categories);
//   const { vendors } = useSelector((state) => state.vendors);
//   const { currentProduct, isLoading } = useSelector((state) => state.products);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     comparePrice: '',
//     category: '',
//     vendor: '',
//     store: '',
//     stock: '',
//     sku: '',
//     tags: '',
//     variants: [],
//     status: 'draft'
//   });
  
//   const [localError, setLocalError] = useState('');
//   const [loadingProduct, setLoadingProduct] = useState(false);

//   const isAdmin = user?.role === 'admin';

//   // ✅ Categories, Vendors load karein + Edit mode mein product data load karein
//   useEffect(() => {
//     dispatch(fetchCategories({ page: 1, limit: 100 }));
//     if (isAdmin) {
//       import('../../app/store/vendorSlice').then(({ fetchVendors }) => {
//         dispatch(fetchVendors({ page: 1, limit: 100 }));
//       });
//     }
    
//     // ✅ Agar edit mode hai, toh product data load karein
//     if (isEditMode) {
//       loadProductData();
//     }
//   }, [dispatch, isAdmin, productId]);

//   // ✅ Product data form mein populate karein
//   useEffect(() => {
//     if (isEditMode && currentProduct) {
//       setFormData({
//         title: currentProduct.title || '',
//         description: currentProduct.description || '',
//         price: currentProduct.price || '',
//         comparePrice: currentProduct.comparePrice || '',
//         category: currentProduct.category?._id || currentProduct.category || '',
//         vendor: currentProduct.vendor?._id || currentProduct.vendor || '',
//         store: currentProduct.store?._id || currentProduct.store || '',
//         stock: currentProduct.stock || '',
//         sku: currentProduct.sku || '',
//         tags: currentProduct.tags?.join(', ') || '',
//         variants: currentProduct.variants || [],
//         status: currentProduct.status || 'draft'
//       });
//     }
//   }, [currentProduct, isEditMode]);

//   const loadProductData = async () => {
//     setLoadingProduct(true);
//     try {
//       await dispatch(fetchProduct(productId)).unwrap();
//     } catch (err) {
//       setLocalError('Failed to load product data');
//       console.error(err);
//     } finally {
//       setLoadingProduct(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setLocalError('');
//   };

//   const addVariant = () => {
//     setFormData({
//       ...formData,
//       variants: [...formData.variants, { name: '', value: '', price: 0, stock: 0 }]
//     });
//   };

//   const removeVariant = (index) => {
//     const newVariants = formData.variants.filter((_, i) => i !== index);
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const updateVariant = (index, field, value) => {
//     const newVariants = [...formData.variants];
//     newVariants[index][field] = value;
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.title.trim()) {
//       setLocalError('Product title is required');
//       return;
//     }
//     if (!formData.price || formData.price <= 0) {
//       setLocalError('Valid price is required');
//       return;
//     }
//     if (!formData.category) {
//       setLocalError('Category is required');
//       return;
//     }
//     if (isAdmin && !formData.vendor) {
//       setLocalError('Please select a vendor for this product');
//       return;
//     }

//     const productData = {
//       ...formData,
//       price: Number(formData.price),
//       comparePrice: Number(formData.comparePrice) || 0,
//       stock: Number(formData.stock) || 0,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
//       variants: formData.variants.filter(v => v.name && v.value)
//     };

//     if (!isAdmin) {
//       delete productData.vendor;
//     }

//     let resultAction;
    
//     if (isEditMode) {
//       // ✅ Edit mode - updateProduct call karein
//       resultAction = await dispatch(updateProduct({ productId, productData }));
//     } else {
//       // ✅ Create mode - createProduct call karein
//       resultAction = await dispatch(createProduct(productData));
//     }
    
//     if (resultAction.type.endsWith('/fulfilled')) {
//       alert(`✅ Product ${isEditMode ? 'updated' : 'created'} successfully!`);
//       navigate('/admin/products');
//     } else {
//       setLocalError(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} product`);
//     }
//   };

//   // ✅ Loading state
//   if (isEditMode && loadingProduct) {
//     return <PageLoader />;
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <button
//         onClick={() => navigate('/admin/products')}
//         className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         <span className="text-sm font-medium">Back to Products</span>
//       </button>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//         {/* ✅ Dynamic Title */}
//         <div className="flex items-center space-x-3 mb-6">
//           {isEditMode ? (
//             <Edit className="w-6 h-6 text-blue-600" />
//           ) : (
//             <Plus className="w-6 h-6 text-blue-600" />
//           )}
//           <h1 className="text-2xl font-bold text-gray-900">
//             {isEditMode ? 'Edit Product' : 'Create New Product'}
//           </h1>
//         </div>

//         {localError && (
//           <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
//             {localError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* ✅ Admin ke liye Vendor Selection */}
//           {isAdmin && (
//             <div className="space-y-4">
//               <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Vendor Assignment</h2>
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-800 mb-3">
//                   ℹ️ As an admin, you need to assign this product to a vendor.
//                 </p>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor *</label>
//                   <select
//                     name="vendor"
//                     value={formData.vendor}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                     required={isAdmin}
//                   >
//                     <option value="">-- Select a Vendor --</option>
//                     {vendors && vendors.map((v) => (
//                       <option key={v._id} value={v._id}>
//                         {v.name} ({v.email})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Basic Information */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
//             <Input
//               label="Product Title"
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               placeholder="e.g., Wireless Bluetooth Headphones"
//             />

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="5"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Detailed product description..."
//                 required
//               />
//             </div>
//           </div>

//           {/* Pricing & Inventory */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Inventory</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="Price (₹)"
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 step="0.01"
//                 placeholder="0.00"
//               />

//               <Input
//                 label="Compare Price (₹) - Optional"
//                 type="number"
//                 name="comparePrice"
//                 value={formData.comparePrice}
//                 onChange={handleChange}
//                 min="0"
//                 step="0.01"
//                 placeholder="0.00"
//               />

//               <Input
//                 label="Stock Quantity"
//                 type="number"
//                 name="stock"
//                 value={formData.stock}
//                 onChange={handleChange}
//                 min="0"
//                 placeholder="0"
//               />

//               <Input
//                 label="SKU"
//                 type="text"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 placeholder="e.g., WBH-001"
//               />
//             </div>
//           </div>

//           {/* Category & Tags */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Classification</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <Input
//                 label="Tags (comma separated)"
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="e.g., electronics, audio, wireless"
//               />
//             </div>
//           </div>

//           {/* ✅ Status Field (sirf edit mode mein) */}
//           {isEditMode && (
//             <div className="space-y-4">
//               <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Status</h2>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Variants */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between border-b pb-2">
//               <h2 className="text-lg font-semibold text-gray-900">Variants (Optional)</h2>
//               <button
//                 type="button"
//                 onClick={addVariant}
//                 className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Variant</span>
//               </button>
//             </div>

//             {formData.variants.length > 0 ? (
//               formData.variants.map((variant, index) => (
//                 <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex-1 min-w-[120px]">
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
//                     <input
//                       type="text"
//                       value={variant.name}
//                       onChange={(e) => updateVariant(index, 'name', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       placeholder="e.g., Size"
//                     />
//                   </div>
//                   <div className="flex-1 min-w-[120px]">
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
//                     <input
//                       type="text"
//                       value={variant.value}
//                       onChange={(e) => updateVariant(index, 'value', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       placeholder="e.g., XL"
//                     />
//                   </div>
//                   <div className="w-24">
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
//                     <input
//                       type="number"
//                       value={variant.price}
//                       onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       min="0"
//                     />
//                   </div>
//                   <div className="w-24">
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
//                     <input
//                       type="number"
//                       value={variant.stock}
//                       onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       min="0"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeVariant(index)}
//                     className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors mb-0.5"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 italic">No variants added yet.</p>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex space-x-3 pt-6 border-t">
//             <Button type="submit" className="flex-1" disabled={isLoading}>
//               <div className="flex items-center space-x-2">
//                 <Save className="w-4 h-4" />
//                 <span>{isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}</span>
//               </div>
//             </Button>
//             <Button 
//               type="button" 
//               variant="outline" 
//               onClick={() => navigate('/admin/products')}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };








import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProduct } from '../../app/store/productSlice';
import { fetchCategories } from '../../app/store/categorySlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, Plus, X, Save, Edit, Upload, Image as ImageIcon } from 'lucide-react';
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
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    vendor: '',
    store: '',
    stock: '',
    sku: '',
    tags: '',
    variants: [],
    status: 'draft',
    images: [] // ✅ File objects array
  });
  
  const [imagePreviews, setImagePreviews] = useState([]); // ✅ Preview URLs
  const [localError, setLocalError] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(false);

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
      loadProductData();
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
        images: [] // Edit mode mein naye images upload honge
      });
      
      // Existing images ke previews show karein
      if (currentProduct.images && currentProduct.images.length > 0) {
        setImagePreviews(currentProduct.images.map(img => ({
          url: img.url,
          isExisting: true,
          publicId: img.publicId
        })));
      }
    }
  }, [currentProduct, isEditMode]);

  const loadProductData = async () => {
    setLoadingProduct(true);
    try {
      await dispatch(fetchProduct(productId)).unwrap();
    } catch (err) {
      setLocalError('Failed to load product data');
      console.error(err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  // ✅ NEW: Image handling functions
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files || files.length === 0) return;
    
    // Max limit check
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > MAX_IMAGES) {
      setLocalError(`Maximum ${MAX_IMAGES} images allowed. You already have ${imagePreviews.length} images.`);
      return;
    }

    // File validation
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError(`File "${file.name}" is too large. Max size is 5MB`);
        return;
      }
      validFiles.push(file);
    }

    // Add to formData
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ([
          ...prev,
          {
            url: reader.result,
            isExisting: false,
            file: file,
            name: file.name
          }
        ]));
      };
      reader.readAsDataURL(file);
    });

    setLocalError('');
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const image = imagePreviews[index];
    
    // Agar naya image hai, toh formData se bhi remove karein
    if (!image.isExisting) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => {
          // File object match karein
          const previewFile = imagePreviews.filter(p => !p.isExisting)[i]?.file;
          return previewFile !== image.file;
        }).slice(0, prev.images.length - 1) // Simple approach: remove last matching
      }));
      
      // Better approach - rebuild images array
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      const newImages = newPreviews.filter(p => !p.isExisting).map(p => p.file);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
  if (isAdmin && !formData.vendor) {
    setLocalError('Please select a vendor for this product');
    return;
  }

  // ✅ Image validation (sirf create mode ke liye)
  const newImagesCount = formData.images.length;
  const existingImagesCount = imagePreviews.filter(p => p.isExisting).length;
  const totalImages = newImagesCount + existingImagesCount;

  if (!isEditMode && totalImages < MIN_IMAGES) {
    setLocalError(`At least ${MIN_IMAGES} images are required. You have uploaded ${totalImages}.`);
    return;
  }

  // ✅ EDIT MODE: Existing images ko alag se bhejo
  const existingImages = isEditMode 
    ? imagePreviews
        .filter(img => img.isExisting)
        .map(img => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: false
        }))
    : [];

  const productData = {
    ...formData,
    price: Number(formData.price),
    comparePrice: Number(formData.comparePrice) || 0,
    stock: Number(formData.stock) || 0,
    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    variants: formData.variants.filter(v => v.name && v.value),
    existingImages, // ✅ Existing images ki info
    // formData.images mein sirf NEW File objects hain
  };

  if (!isAdmin) {
    delete productData.vendor;
  }

  console.log('📤 Submitting:', {
    existingImages: existingImages.length,
    newFiles: formData.images.length,
    total: existingImages.length + formData.images.length
  });

  let resultAction;
  
  if (isEditMode) {
    resultAction = await dispatch(updateProduct({ productId, productData }));
  } else {
    resultAction = await dispatch(createProduct(productData));
  }
  
  if (resultAction.type.endsWith('/fulfilled')) {
    alert(`✅ Product ${isEditMode ? 'updated' : 'created'} successfully!`);
    navigate('/admin/products');
  } else {
    setLocalError(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} product`);
  }
};

  if (isEditMode && loadingProduct) {
    return <PageLoader />;
  }

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
        <div className="flex items-center space-x-3 mb-6">
          {isEditMode ? (
            <Edit className="w-6 h-6 text-blue-600" />
          ) : (
            <Plus className="w-6 h-6 text-blue-600" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h1>
        </div>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* ✅ NEW: Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                Product Images
              </h2>
              <span className="text-sm text-gray-500">
                {imagePreviews.length} / {MAX_IMAGES} images
                {!isEditMode && <span className="text-red-500 ml-1">* (min {MIN_IMAGES})</span>}
              </span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  PNG, JPG, WEBP up to 5MB each • Minimum {MIN_IMAGES} images required
                </p>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={imagePreviews.length >= MAX_IMAGES}
                  />
                  Select Images
                </label>
              </div>
            </div>

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {img.name || `Image ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No images uploaded yet. Please upload at least {MIN_IMAGES} images.
              </p>
            )}
          </div>

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

          {isEditMode && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Status</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

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
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}</span>
              </div>
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