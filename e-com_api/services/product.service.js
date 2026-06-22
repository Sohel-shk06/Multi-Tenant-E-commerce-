import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// ADMIN: Get all products with filters
// ============================================
export const getAllProducts = async (query) => {
  try {
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
    
    // ✅ Type conversion with validation
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;
    
    const filter = {};

    // ✅ Search filter - empty string handle karo
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // ✅ Category filter - valid ObjectId check
    if (category && category.toString().trim() !== '') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      }
    }
    
    // ✅ Vendor filter - valid ObjectId check
    if (vendor && vendor.toString().trim() !== '') {
      if (mongoose.Types.ObjectId.isValid(vendor)) {
        filter.vendor = vendor;
      }
    }
    
    // Status filter
    if (status && status.trim() !== '') {
      filter.status = status;
    }
    
    // ✅ Price range filter with validation
    if (minPrice || maxPrice) {
      filter.price = {};
      const minPriceNum = parseFloat(minPrice);
      const maxPriceNum = parseFloat(maxPrice);
      
      if (!isNaN(minPriceNum)) filter.price.$gte = minPriceNum;
      if (!isNaN(maxPriceNum)) filter.price.$lte = maxPriceNum;
      
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    console.log('🔍 Product filter:', JSON.stringify(filter));

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'name email')
      .populate('store', 'name slug')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    return {
      products,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      currentPage: pageNum,
      totalProducts
    };
  } catch (error) {
    console.error('❌ Error in getAllProducts:', error);
    throw new ApiError(500, `Failed to fetch products: ${error.message}`);
  }
};

// ============================================
// Get single product by ID
// ============================================
export const getProductById = async (productId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    const product = await Product.findById(productId)
      .populate('category', 'name slug')
      .populate('vendor', 'name email')
      .populate('store', 'name slug');
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in getProductById:', error);
    throw new ApiError(500, `Failed to fetch product: ${error.message}`);
  }
};

// ============================================
// Create new product (with images)
// ============================================
export const createProduct = async (productData, vendorId, storeId) => {
  console.log('🔧 Creating product with:', { vendorId, storeId });

  const { title, description, price, comparePrice, category, variants, tags, stock, sku, images } = productData;

  // ✅ Validation
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Product title is required');
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, 'Product description is required');
  }
  if (!price || Number(price) <= 0) {
    throw new ApiError(400, 'Valid price is required');
  }
  if (!category) {
    throw new ApiError(400, 'Category is required');
  }
  if (!storeId) {
    throw new ApiError(400, 'Store ID is required');
  }

  // ✅ Parse variants agar JSON string hai
  let parsedVariants = variants || [];
  if (typeof variants === 'string') {
    try {
      parsedVariants = JSON.parse(variants);
    } catch (e) {
      console.warn('⚠️ Invalid variants JSON, using empty array');
      parsedVariants = [];
    }
  }

  // ✅ Parse tags agar array nahi hai
  let parsedTags = tags || [];
  if (typeof tags === 'string') {
    parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  try {
    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      comparePrice: Number(comparePrice) || 0,
      category,
      vendor: vendorId,
      store: storeId,
      images: images || [],
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
    
    if (error.code === 11000) {
      throw new ApiError(409, 'Product with this title or SKU already exists');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, messages.join(', '));
    }
    
    throw new ApiError(500, `Failed to create product: ${error.message}`);
  }
};

// ✅ UPDATED: Smart image update - existing images preserve karega
export const updateProduct = async (productId, updateData, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Ownership check (skip for admin)
    if (vendorId && product.vendor.toString() !== vendorId) {
      throw new ApiError(403, 'You are not authorized to update this product');
    }

    // ✅ SMART IMAGE HANDLING - Purani images delete karo jo admin ne remove ki
    if (product.images && product.images.length > 0 && updateData.images) {
      const newPublicIds = updateData.images
        .map(img => img.publicId)
        .filter(Boolean);
      
      // Woh images dhundho jo admin ne remove ki hain
      const imagesToDelete = product.images.filter(
        oldImg => oldImg.publicId && !newPublicIds.includes(oldImg.publicId)
      );

      // ✅ Sirf woh images delete karo jo admin ne remove ki hain
      if (imagesToDelete.length > 0) {
        try {
          const { deleteFromCloudinary } = await import('../utils/cloudinaryUploader.js');
          for (const img of imagesToDelete) {
            await deleteFromCloudinary(img.publicId);
            console.log('✅ Deleted old image from Cloudinary:', img.publicId);
          }
        } catch (error) {
          console.warn('⚠️  Failed to delete some old images:', error.message);
        }
      }
    }

    // ✅ Parse variants agar JSON string hai
    if (updateData.variants && typeof updateData.variants === 'string') {
      try {
        updateData.variants = JSON.parse(updateData.variants);
      } catch (e) {
        delete updateData.variants;
      }
    }

    // ✅ Parse tags agar string hai
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // ✅ Number fields convert karo
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.comparePrice) updateData.comparePrice = Number(updateData.comparePrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    Object.assign(product, updateData);
    await product.save();

    console.log('✅ Product updated with', product.images?.length || 0, 'images');
    return product;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in updateProduct:', error);
    throw new ApiError(500, `Failed to update product: ${error.message}`);
  }
};
// ============================================
// Delete product
// ============================================
export const deleteProduct = async (productId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (vendorId && product.vendor.toString() !== vendorId) {
      throw new ApiError(403, 'You are not authorized to delete this product');
    }

    // ✅ Cloudinary se images delete karo
    if (product.images && product.images.length > 0) {
      const { deleteFromCloudinary } = await import('../utils/cloudinaryUploader.js');
      for (const img of product.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
    }

    await Product.findByIdAndDelete(productId);
    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in deleteProduct:', error);
    throw new ApiError(500, `Failed to delete product: ${error.message}`);
  }
};

// ============================================
// Update product status
// ============================================
export const updateProductStatus = async (productId, status, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

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
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in updateProductStatus:', error);
    throw new ApiError(500, `Failed to update status: ${error.message}`);
  }
};

// ============================================
// Get products for moderation (draft status)
// ============================================
export const getProductsForModeration = async (query) => {
  try {
    const { page = 1, limit = 10, search } = query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;
    
    const filter = { status: 'draft' };
    
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'name email')
      .populate('store', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    return {
      products,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      currentPage: pageNum,
      totalProducts
    };
  } catch (error) {
    console.error('❌ Error in getProductsForModeration:', error);
    throw new ApiError(500, `Failed to fetch products: ${error.message}`);
  }
};

// ============================================
// Moderate product (approve or reject)
// ============================================
export const moderateProduct = async (productId, action, adminNotes) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

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
      product.moderatedBy = 'admin';
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
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in moderateProduct:', error);
    throw new ApiError(500, `Failed to moderate product: ${error.message}`);
  }
};

// ============================================
// PUBLIC: Customer Facing Functions
// ============================================
export const getPublicProducts = async (query) => {
  try {
    const { page = 1, limit = 12, search, category, minPrice, maxPrice, sort } = query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;
    
    const filter = { status: 'active' };
    
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      const minPriceNum = parseFloat(minPrice);
      const maxPriceNum = parseFloat(maxPrice);
      
      if (!isNaN(minPriceNum)) filter.price.$gte = minPriceNum;
      if (!isNaN(maxPriceNum)) filter.price.$lte = maxPriceNum;
      
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // Determine sort order
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price_desc') {
      sortObj = { price: -1 };
    } else if (sort === 'rating') {
      sortObj = { averageRating: -1 };
    } else if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate({
        path: 'store',
        select: 'name slug vendor',
        populate: { 
          path: 'vendor', 
          select: '_id name'
        }
      })
      .skip(skip)
      .limit(limitNum)
      .sort(sortObj);

    const totalProducts = await Product.countDocuments(filter);

    return {
      products,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      currentPage: pageNum,
      totalProducts
    };
  } catch (error) {
    console.error('❌ Error in getPublicProducts:', error);
    throw new ApiError(500, `Failed to fetch products: ${error.message}`);
  }
};

export const getPublicProduct = async (productId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    const product = await Product.findOne({ _id: productId, status: 'active' })
      .populate('category', 'name slug')
      .populate({
        path: 'store',
        select: 'name slug vendor',
        populate: { 
          path: 'vendor', 
          select: '_id name'
        }
      });
    
    if (!product) {
      throw new ApiError(404, 'Product not found or is no longer available');
    }
    return product;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('❌ Error in getPublicProduct:', error);
    throw new ApiError(500, `Failed to fetch product: ${error.message}`);
  }
};