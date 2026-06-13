import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

// Get all products with filters
export const getAllProducts = async (query) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    vendor,
    status,
    minPrice,
    maxPrice
  } = query;
  
  const skip = (page - 1) * limit;
  const filter = {};

  // Search filter
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Category filter
  if (category) filter.category = category;
  
  // Vendor filter
  if (vendor) filter.vendor = vendor;
  
  // Status filter
  if (status) filter.status = status;
  
  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate('vendor', 'name email')
    .populate('store', 'name slug')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: Number(page),
    totalProducts
  };
};

// Get single product by ID
export const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate('category', 'name slug')
    .populate('vendor', 'name email')
    .populate('store', 'name slug');
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

// Create new product
// Create new product
export const createProduct = async (productData, vendorId, storeId) => {
  console.log('🔧 Creating product with:', { productData, vendorId, storeId }); // Debug log

  const { title, description, price, comparePrice, category, variants, tags, stock, sku } = productData;

  // Validation
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Product title is required');
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, 'Product description is required');
  }
  if (!price || price <= 0) {
    throw new ApiError(400, 'Valid price is required');
  }
  if (!category) {
    throw new ApiError(400, 'Category is required');
  }
  if (!storeId) {
    throw new ApiError(400, 'Store ID is required');
  }

  try {
    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price,
      comparePrice: comparePrice || 0,
      category,
      vendor: vendorId,
      store: storeId,
      variants: variants || [],
      tags: tags || [],
      stock: stock || 0,
      sku: sku || undefined,
      status: 'draft'
    });

    console.log('✅ Product created:', product._id);
    return product;
  } catch (error) {
    console.error('❌ Database error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ApiError(409, 'Product with this title or SKU already exists');
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, messages.join(', '));
    }
    
    throw error;
  }
};




// Update product
export const updateProduct = async (productId, updateData, vendorId) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // ✅ FIX: Agar vendorId null hai (admin hai), toh ownership check skip karo
  if (vendorId && product.vendor.toString() !== vendorId) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  Object.assign(product, updateData);
  await product.save();

  return product;
};

// Delete product
export const deleteProduct = async (productId, vendorId) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // ✅ FIX: Agar vendorId null hai (admin hai), toh ownership check skip karo
  if (vendorId && product.vendor.toString() !== vendorId) {
    throw new ApiError(403, 'You are not authorized to delete this product');
  }

  await Product.findByIdAndDelete(productId);
  return true;
};

// Update product status
export const updateProductStatus = async (productId, status, vendorId) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (vendorId && product.vendor.toString() !== vendorId) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  product.status = status;
  await product.save();

  return product;
};



// Get products pending moderation (draft status)
export const getProductsForModeration = async (query) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;
  
  const filter = { status: 'draft' }; // Sirf draft products moderation ke liye
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate('vendor', 'name email')
    .populate('store', 'name')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: Number(page),
    totalProducts
  };
};

// Moderate product (approve or reject)
export const moderateProduct = async (productId, action, adminNotes) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.status !== 'draft') {
    throw new ApiError(400, 'Only draft products can be moderated');
  }

  if (action === 'approve') {
    product.status = 'active';
    product.moderationNotes = adminNotes || '';
    product.moderatedAt = new Date();
    product.moderatedBy = 'admin'; // TODO: req.user.id pass karna
  } else if (action === 'reject') {
    product.status = 'rejected';
    product.moderationNotes = adminNotes || 'Product does not meet platform guidelines';
    product.moderatedAt = new Date();
    product.moderatedBy = 'admin';
  } else {
    throw new ApiError(400, 'Invalid moderation action');
  }

  await product.save();
  return product;
};


// ===== PUBLIC: Customer Facing Functions =====

// Get all ACTIVE products for customers
export const getPublicProducts = async (query) => {
  const { page = 1, limit = 12, search, category, minPrice, maxPrice } = query;
  const skip = (page - 1) * limit;
  
  const filter = { status: 'active' };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) filter.category = category;
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate({
      path: 'store',
      select: 'name slug vendor',  // ✅ vendor field include kiya
      populate: { 
        path: 'vendor', 
        select: '_id name'  // ✅ vendor populate kiya with ID
      }
    })
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: Number(page),
    totalProducts
  };
};

// Get single active product by ID
export const getPublicProduct = async (productId) => {
  const product = await Product.findOne({ _id: productId, status: 'active' })
    .populate('category', 'name slug')
    .populate({
      path: 'store',
      select: 'name slug vendor',  // ✅ vendor field include kiya
      populate: { 
        path: 'vendor', 
        select: '_id name'  // ✅ vendor populate kiya with ID
      }
    });
  
  if (!product) {
    throw new ApiError(404, 'Product not found or is no longer available');
  }
  return product;
};