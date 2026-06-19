import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as productService from '../services/product.service.js';
import { Store } from '../models/Store.js';
import { uploadMultipleToCloudinary } from '../utils/cloudinaryUploader.js';

// ============================================
// ADMIN: Get all products
// ============================================
export const getProducts = asyncHandler(async (req, res) => {
  console.log('\n📥 ========== ADMIN GET PRODUCTS ==========');
  console.log('👤 User:', req.user?.role, req.user?._id);
  console.log('📋 Query params:', req.query);
  
  // ✅ Role check
  if (req.user.role !== 'admin') {
    console.error('❌ User is not admin:', req.user.role);
    throw new ApiError(403, 'Only admins can access this endpoint');
  }
  
  try {
    const result = await productService.getAllProducts(req.query);
    console.log('✅ Products fetched:', result.products.length, 'products');
    console.log('🔍 ========== END ==========\n');
    return res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
  } catch (error) {
    console.error('❌ Error in getProducts:', error.message);
    console.error('❌ Stack:', error.stack);
    console.log('🔍 ========== END ==========\n');
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`
    });
  }
});

// ============================================
// Get single product
// ============================================
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

// ============================================
// CREATE Product with image upload
// ============================================
export const createProduct = asyncHandler(async (req, res) => {
  let vendorId, storeId;

  console.log('📥 Creating product with data:', req.body);
  console.log('📸 Files received:', req.files?.length || 0);

  // ✅ Image validation - at least 3 images required
  if (!req.files || req.files.length < 3) {
    throw new ApiError(400, 'At least 3 product images are required');
  }

  // ✅ Upload images to Cloudinary
  console.log('📤 Uploading images to Cloudinary...');
  let uploadedImages;
  try {
    uploadedImages = await uploadMultipleToCloudinary(req.files, 'products');
    console.log(`✅ ${uploadedImages.length} images uploaded successfully`);
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    throw new ApiError(500, 'Failed to upload images. Please try again.');
  }

  // ✅ Prepare images array
  const images = uploadedImages.map((img, index) => ({
    url: img.url,
    publicId: img.publicId,
    isPrimary: index === 0
  }));

  // ✅ Vendor aur Store determine karein
  if (req.user.role === 'admin') {
    vendorId = req.body.vendor;
    storeId = req.body.store;
    
    if (!vendorId) {
      throw new ApiError(400, 'Vendor ID is required when admin creates a product');
    }

    if (!storeId) {
      const vendorStore = await Store.findOne({ vendor: vendorId });
      if (!vendorStore) {
        throw new ApiError(400, 'Vendor has no store. Please create a store first.');
      }
      storeId = vendorStore._id;
    }
  } else {
    vendorId = req.user._id;
    storeId = req.body.store;

    if (!storeId) {
      const vendorStore = await Store.findOne({ vendor: vendorId });
      if (!vendorStore) {
        throw new ApiError(400, 'You have no store. Please create a store first.');
      }
      storeId = vendorStore._id;
    }
  }

  // ✅ Product data mein images add karein
  const productData = {
    ...req.body,
    images
  };

  const product = await productService.createProduct(productData, vendorId, storeId);
  
  return res.status(201).json(
    new ApiResponse(201, product, 'Product created successfully with images')
  );
});

// ✅ UPDATED: Existing images preserve karega + new images add karega
export const updateProduct = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  
  console.log('\n📥 ========== UPDATE PRODUCT ==========');
  console.log('📸 New files received:', req.files?.length || 0);
  console.log('🖼️  Existing images (JSON):', req.body.existingImages);

  // ✅ Parse existingImages (jo admin ne rakhi hain)
  let existingImages = [];
  if (req.body.existingImages) {
    try {
      existingImages = typeof req.body.existingImages === 'string'
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages;
    } catch (e) {
      console.warn('⚠️  Failed to parse existingImages:', e.message);
      existingImages = [];
    }
  }
  console.log('✅ Parsed existing images:', existingImages.length);

  // ✅ Naye images upload karo (agar hain)
  let newUploadedImages = [];
  if (req.files && req.files.length > 0) {
    console.log('📤 Uploading new images to Cloudinary...');
    try {
      const uploadedImages = await uploadMultipleToCloudinary(req.files, 'products');
      newUploadedImages = uploadedImages.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        isPrimary: false
      }));
      console.log(`✅ ${newUploadedImages.length} new images uploaded`);
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      throw new ApiError(500, 'Failed to upload new images');
    }
  }

  // ✅ Final images array: existing + new
  const finalImages = [...existingImages, ...newUploadedImages];
  
  // Pehli image ko primary banao (agar koi image hai)
  if (finalImages.length > 0) {
    finalImages[0].isPrimary = true;
  }

  console.log('📊 Final images count:', finalImages.length);
  console.log('🔍 ========== END ==========\n');

  // Update data prepare karo
  const updateData = { ...req.body };
  updateData.images = finalImages; // ✅ MERGED images
  delete updateData.existingImages; // Cleanup

  const product = await productService.updateProduct(req.params.productId, updateData, vendorId);
  return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

// ============================================
// DELETE Product
// ============================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  await productService.deleteProduct(req.params.productId, vendorId);
  return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

// ============================================
// UPDATE Product Status
// ============================================
export const updateProductStatus = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  const { status } = req.body;
  const product = await productService.updateProductStatus(req.params.productId, status, vendorId);
  return res.status(200).json(new ApiResponse(200, product, `Product ${status} successfully`));
});

// ============================================
// Get products for moderation
// ============================================
export const getProductsForModeration = asyncHandler(async (req, res) => {
  const result = await productService.getProductsForModeration(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Products for moderation fetched successfully'));
});

// ============================================
// Moderate product
// ============================================
export const moderateProduct = asyncHandler(async (req, res) => {
  const { action, notes } = req.body;
  const product = await productService.moderateProduct(req.params.productId, action, notes);
  return res.status(200).json(new ApiResponse(200, product, `Product ${action}d successfully`));
});

// ============================================
// PUBLIC: Customer Facing
// ============================================
export const getPublicProducts = asyncHandler(async (req, res) => {
  const result = await productService.getPublicProducts(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
});

export const getPublicProduct = asyncHandler(async (req, res) => {
  const product = await productService.getPublicProduct(req.params.productId);
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});