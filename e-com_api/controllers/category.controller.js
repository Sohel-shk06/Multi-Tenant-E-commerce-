import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as categoryService from '../services/category.service.js';

export const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Categories fetched successfully'));
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  return res.status(200).json(new ApiResponse(200, category, 'Category fetched successfully'));
});

export const createCategory = asyncHandler(async (req, res) => {
  console.log('📥 Creating category with data:', req.body); // 🔍 Debug log
  
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  } catch (error) {
    console.error('❌ Error creating category:', error); // 🔍 Detailed error log
    throw error;
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.categoryId, req.body);
  return res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.categoryId);
  return res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});