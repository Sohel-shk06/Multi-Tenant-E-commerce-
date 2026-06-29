import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as vendorService from '../services/vendor.service.js';

// ===== ADMIN VENDOR MANAGEMENT =====

export const getVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.getAllVendors(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vendors fetched successfully'));
});

export const getVendorById = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const vendor = await vendorService.getVendorById(vendorId);
  return res.status(200).json(new ApiResponse(200, vendor, 'Vendor fetched successfully'));
});

export const updateVendorStatus = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const { status } = req.body;
  const vendor = await vendorService.updateVendorStatus(vendorId, status);
  return res.status(200).json(new ApiResponse(200, vendor, `Vendor ${status} successfully`));
});

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendorByAdmin(req.body);
  return res.status(201).json(new ApiResponse(201, vendor, 'Vendor created successfully'));
});

// ===== VENDOR DASHBOARD =====

export const getVendorStats = asyncHandler(async (req, res) => {
  const stats = await vendorService.getVendorStats(req.user._id);
  return res.status(200).json(new ApiResponse(200, stats, 'Vendor stats fetched successfully'));
});

export const getVendorRevenueChart = asyncHandler(async (req, res) => {
  const chartData = await vendorService.getVendorRevenueChart(req.user._id);
  return res.status(200).json(new ApiResponse(200, chartData, 'Revenue chart fetched successfully'));
});

export const getVendorRecentOrders = asyncHandler(async (req, res) => {
  const orders = await vendorService.getVendorRecentOrders(req.user._id);
  return res.status(200).json(new ApiResponse(200, orders, 'Recent orders fetched successfully'));
});

// ===== VENDOR: Product Management =====

export const getVendorProducts = asyncHandler(async (req, res) => {
  console.log('📥 Fetching products for vendor:', req.user._id);
  console.log('📥 Query params:', req.query);
  try {
    const result = await vendorService.getVendorProducts(req.user._id, req.query);
    console.log('✅ Products fetched:', result.products.length, 'products');
    return res.status(200).json(new ApiResponse(200, result, 'Vendor products fetched successfully'));
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
});

export const getVendorProduct = asyncHandler(async (req, res) => {
  const product = await vendorService.getVendorProduct(req.user._id, req.params.productId);
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const deleteVendorProduct = asyncHandler(async (req, res) => {
  await vendorService.deleteVendorProduct(req.user._id, req.params.productId);
  return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

// ===== VENDOR: Store Management =====
// ===== VENDOR: Store Management =====

export const getVendorStores = asyncHandler(async (req, res) => {
  const stores = await vendorService.getVendorStores(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, stores, 'Vendor stores fetched successfully'));
});

export const getVendorStoresList = asyncHandler(async (req, res) => {
  const stores = await vendorService.getVendorStoresSimple(req.user._id);
  return res.status(200).json(new ApiResponse(200, stores, 'Vendor stores list fetched successfully'));
});

export const getVendorStore = asyncHandler(async (req, res) => {
  const store = await vendorService.getVendorStoreById(req.user._id, req.params.storeId);
  return res.status(200).json(new ApiResponse(200, store, 'Store fetched successfully'));
});

// ✅ UPDATED: createVendorStore with file upload
export const createVendorStore = asyncHandler(async (req, res) => {
  const storeData = { ...req.body };
  if (req.files) {
    const { uploadToCloudinary } = await import('../utils/cloudinaryUploader.js');
    if (req.files.logo && req.files.logo[0]) {
      const uploadResult = await uploadToCloudinary(req.files.logo[0].buffer, 'stores');
      storeData.logo = uploadResult.url;
    }
    if (req.files.banner && req.files.banner[0]) {
      const uploadResult = await uploadToCloudinary(req.files.banner[0].buffer, 'stores');
      storeData.banner = uploadResult.url;
    }
  }

  const store = await vendorService.createVendorStore(req.user._id, storeData);
  return res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
});

// ✅ UPDATED: updateVendorStore with file upload
export const updateVendorStore = asyncHandler(async (req, res) => {
  const storeData = { ...req.body };
  
  // Get current store to delete old images if new ones are uploaded
  const currentStore = await vendorService.getVendorStoreById(req.user._id, req.params.storeId);
  
  if (req.files) {
    const { uploadToCloudinary, deleteFromCloudinary } = await import('../utils/cloudinaryUploader.js');
    
    const getPublicIdFromUrl = (url) => {
      if (!url || !url.includes('cloudinary')) return null;
      try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        const pathAndExt = parts[1].replace(/^v\d+\//, '');
        return pathAndExt.substring(0, pathAndExt.lastIndexOf('.'));
      } catch (error) {
        return null;
      }
    };

    if (req.files.logo && req.files.logo[0]) {
      if (currentStore && currentStore.logo) {
        const oldPublicId = getPublicIdFromUrl(currentStore.logo);
        if (oldPublicId) await deleteFromCloudinary(oldPublicId);
      }
      const uploadResult = await uploadToCloudinary(req.files.logo[0].buffer, 'stores');
      storeData.logo = uploadResult.url;
    }
    
    if (req.files.banner && req.files.banner[0]) {
      if (currentStore && currentStore.banner) {
        const oldPublicId = getPublicIdFromUrl(currentStore.banner);
        if (oldPublicId) await deleteFromCloudinary(oldPublicId);
      }
      const uploadResult = await uploadToCloudinary(req.files.banner[0].buffer, 'stores');
      storeData.banner = uploadResult.url;
    }
  }

  const store = await vendorService.updateVendorStore(req.user._id, req.params.storeId, storeData);
  return res.status(200).json(new ApiResponse(200, store, 'Store updated successfully'));
});

export const deleteVendorStore = asyncHandler(async (req, res) => {
  await vendorService.deleteVendorStore(req.user._id, req.params.storeId);
  return res.status(200).json(new ApiResponse(200, null, 'Store deleted successfully'));
});

// ===== VENDOR: Order Management =====

export const getVendorOrders = asyncHandler(async (req, res) => {
    console.log('\n📦 ========== GET VENDOR ORDERS ==========');
    console.log('👤 User:', req.user?.role, req.user?._id);
    console.log('📋 Query params:', req.query);
    
    // ✅ Role check
    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
        console.error('❌ User is not vendor or admin:', req.user.role);
        throw new ApiError(403, 'Only vendors and admins can access orders');
    }
    
    try {
        const result = await vendorService.getVendorOrders(req.user._id, req.query);
        console.log('✅ Orders fetched:', result.orders.length, 'orders');
        console.log('📦 ========== END ==========\n');
        return res.status(200).json(new ApiResponse(200, result, 'Vendor orders fetched successfully'));
    } catch (error) {
        console.error('❌ Error in getVendorOrders:', error.message);
        console.error('❌ Stack:', error.stack);
        console.log('📦 ========== END ==========\n');
        
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, `Failed to fetch orders: ${error.message}`);
    }
});

export const getVendorOrder = asyncHandler(async (req, res) => {
  const order = await vendorService.getVendorOrderById(req.user._id, req.params.orderId);
  return res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

export const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await vendorService.updateVendorOrderStatus(req.user._id, req.params.orderId, status);
  return res.status(200).json(new ApiResponse(200, order, `Order status updated to ${status}`));
});

// ===== VENDOR: Earnings =====

export const getVendorEarningsOverview = asyncHandler(async (req, res) => {
  const overview = await vendorService.getVendorEarningsOverview(req.user._id);
  return res.status(200).json(new ApiResponse(200, overview, 'Earnings overview fetched successfully'));
});

export const getVendorPayoutHistory = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorPayoutHistory(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Payout history fetched successfully'));
});

export const requestVendorPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const payout = await vendorService.requestVendorPayout(req.user._id, amount);
  return res.status(201).json(new ApiResponse(201, payout, 'Payout request submitted successfully'));
});

export const getVendorMonthlyEarnings = asyncHandler(async (req, res) => {
  const data = await vendorService.getVendorMonthlyEarnings(req.user._id);
  return res.status(200).json(new ApiResponse(200, data, 'Monthly earnings fetched successfully'));
});

// ===== VENDOR: Review Management =====

export const getVendorReviews = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorReviews(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vendor reviews fetched successfully'));
});

export const getVendorReview = asyncHandler(async (req, res) => {
  const review = await vendorService.getVendorReview(req.user._id, req.params.reviewId);
  return res.status(200).json(new ApiResponse(200, review, 'Review fetched successfully'));
});

export const replyToReview = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const review = await vendorService.replyToReview(req.user._id, req.params.reviewId, reply);
  return res.status(200).json(new ApiResponse(200, review, 'Reply submitted successfully'));
});

export const deleteVendorReply = asyncHandler(async (req, res) => {
  const review = await vendorService.deleteVendorReply(req.user._id, req.params.reviewId);
  return res.status(200).json(new ApiResponse(200, review, 'Reply deleted successfully'));
});

export const getVendorReviewAnalytics = asyncHandler(async (req, res) => {
  const analytics = await vendorService.getVendorReviewAnalytics(req.user._id);
  return res.status(200).json(new ApiResponse(200, analytics, 'Review analytics fetched successfully'));
});

// ===== VENDOR: Analytics =====

export const getVendorRevenueAnalytics = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorRevenueAnalytics(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Revenue analytics fetched successfully'));
});

export const getVendorProductAnalytics = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorProductAnalytics(req.user._id);
  return res.status(200).json(new ApiResponse(200, result, 'Product analytics fetched successfully'));
});

export const getVendorOrderAnalytics = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorOrderAnalytics(req.user._id);
  return res.status(200).json(new ApiResponse(200, result, 'Order analytics fetched successfully'));
});

export const getVendorCustomerAnalytics = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorCustomerAnalytics(req.user._id);
  return res.status(200).json(new ApiResponse(200, result, 'Customer analytics fetched successfully'));
});

export const getVendorSalesAnalytics = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendorSalesAnalytics(req.user._id);
  return res.status(200).json(new ApiResponse(200, result, 'Sales analytics fetched successfully'));
});

// ===== VENDOR: Product Create & Update =====

export const createVendorProduct = asyncHandler(async (req, res) => {
  console.log('📥 Creating product with data:', req.body);
  console.log('📸 Files received:', req.files?.length || 0);
  console.log('👤 Vendor ID:', req.user._id);
  try {
    if (!req.files || req.files.length < 3) {
      throw new ApiError(400, 'At least 3 product images are required');
    }
    console.log('📤 Uploading images to Cloudinary...');
    const { uploadMultipleToCloudinary } = await import('../utils/cloudinaryUploader.js');
    const uploadedImages = await uploadMultipleToCloudinary(req.files, 'products');
    console.log(`✅ ${uploadedImages.length} images uploaded successfully`);
    const images = uploadedImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      isPrimary: index === 0
    }));
    const productData = { ...req.body, images };
    const product = await vendorService.createVendorProduct(req.user._id, productData);
    console.log('✅ Product created:', product._id);
    return res.status(201).json(new ApiResponse(201, product, 'Product created successfully with images'));
  } catch (error) {
    console.error('❌ Error creating product:', error);
    throw error;
  }
});

export const updateVendorProduct = asyncHandler(async (req, res) => {
  console.log('📥 Updating product:', req.params.productId);
  console.log('📸 New files received:', req.files?.length || 0);
  console.log('🖼️  Existing images:', req.body.existingImages);
  const updateData = { ...req.body };
  if (req.files && req.files.length > 0) {
    updateData.images = req.files;
  } else {
    updateData.images = [];
  }
  const product = await vendorService.updateVendorProduct(req.user._id, req.params.productId, updateData);
  return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});