import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as productService from '../services/product.service.js';
import { Store } from '../models/Store.js';

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const createProduct = asyncHandler(async (req, res) => {
  let vendorId, storeId;

  console.log('📥 Creating product with data:', req.body); // Debug log

  // Agar Admin hai, toh vendor aur store ID request body se lo
  if (req.user.role === 'admin') {
    vendorId = req.body.vendor;
    storeId = req.body.store;
    
    if (!vendorId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vendor ID is required when admin creates a product' 
      });
    }

    // ✅ FIX: Agar store ID nahi di, toh vendor ka pehla store auto-select karo
    if (!storeId) {
      const vendorStore = await Store.findOne({ vendor: vendorId });
      if (!vendorStore) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vendor has no store. Please create a store for this vendor first.' 
        });
      }
      storeId = vendorStore._id;
      console.log('✅ Auto-selected store:', storeId);
    }
  } else {
    // Vendor ke liye logged-in user ka ID use karo
    vendorId = req.user._id;
    storeId = req.body.store;

    // ✅ FIX: Agar vendor ne store nahi diya, toh unka pehla store auto-select karo
    if (!storeId) {
      const vendorStore = await Store.findOne({ vendor: vendorId });
      if (!vendorStore) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have no store. Please create a store first.' 
        });
      }
      storeId = vendorStore._id;
    }
  }

  try {
    const product = await productService.createProduct(req.body, vendorId, storeId);
    return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    console.error('❌ Error creating product:', error);
    throw error;
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  const product = await productService.updateProduct(req.params.productId, req.body, vendorId);
  return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  await productService.deleteProduct(req.params.productId, vendorId);
  return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' ? null : req.user._id;
  const { status } = req.body;
  const product = await productService.updateProductStatus(req.params.productId, status, vendorId);
  return res.status(200).json(new ApiResponse(200, product, `Product ${status} successfully`));
});