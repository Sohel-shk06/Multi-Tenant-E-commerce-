import api from './api';

export const productService = {
  // ✅ Admin products list
  getProducts: async (params) => {
  // ✅ Empty/invalid parameters ko filter karein
  const cleanParams = {};
  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      // Sirf valid values add karein
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });
  }
  
  console.log('📡 Fetching admin products with params:', cleanParams);
  const response = await api.get('/products/all', { params: cleanParams });
  return response.data.data;
},

  // Single product
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  },

  // ✅ CREATE with FormData (images)
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Text fields
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('comparePrice', productData.comparePrice || 0);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock || 0);
    formData.append('sku', productData.sku || '');
    formData.append('status', productData.status || 'draft');
    
    if (productData.vendor) formData.append('vendor', productData.vendor);
    if (productData.store) formData.append('store', productData.store);
    
    // Tags
    if (productData.tags && productData.tags.length > 0) {
      productData.tags.forEach(tag => formData.append('tags[]', tag));
    }
    
    // Variants
    if (productData.variants && productData.variants.length > 0) {
      formData.append('variants', JSON.stringify(productData.variants));
    }
    
    // ✅ Multiple images
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach(file => {
        formData.append('images', file);
      });
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  // ✅ UPDATED: Existing images + new images dono bhejega
updateProduct: async (productId, productData) => {
  const formData = new FormData();
  
  // Text fields
  if (productData.title !== undefined) formData.append('title', productData.title);
  if (productData.description !== undefined) formData.append('description', productData.description);
  if (productData.price !== undefined) formData.append('price', productData.price);
  if (productData.comparePrice !== undefined) formData.append('comparePrice', productData.comparePrice);
  if (productData.category !== undefined) formData.append('category', productData.category);
  if (productData.stock !== undefined) formData.append('stock', productData.stock);
  if (productData.sku !== undefined) formData.append('sku', productData.sku);
  if (productData.status !== undefined) formData.append('status', productData.status);
  if (productData.vendor) formData.append('vendor', productData.vendor);
  if (productData.store) formData.append('store', productData.store);
  
  // Tags
  if (productData.tags && productData.tags.length > 0) {
    productData.tags.forEach(tag => formData.append('tags[]', tag));
  }
  
  // Variants
  if (productData.variants && productData.variants.length > 0) {
    formData.append('variants', JSON.stringify(productData.variants));
  }
  
  // ✅ EXISTING IMAGES (jo admin ne rakhi hain) - JSON string
  if (productData.existingImages !== undefined) {
    formData.append('existingImages', JSON.stringify(productData.existingImages));
  }
  
  // ✅ NEW IMAGES (File objects) - multipart
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach(file => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });
  }

  const response = await api.patch(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
},

  // Delete
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data.data;
  },

  // Update status
  updateProductStatus: async (productId, status) => {
    const response = await api.patch(`/products/${productId}/status`, { status });
    return response.data.data;
  },

  // Moderation
  getProductsForModeration: async (params) => {
    const response = await api.get('/products/moderation/pending', { params });
    return response.data.data;
  },

  moderateProduct: async (productId, action, notes = '') => {
    const response = await api.patch(`/products/${productId}/moderate`, { action, notes });
    return response.data.data;
  }
};