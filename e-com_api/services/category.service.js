import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

// Get all categories with pagination
export const getAllCategories = async (query) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const categories = await Category.find(filter)
    .populate('parent', 'name')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalCategories = await Category.countDocuments(filter);

  return {
    categories,
    totalPages: Math.ceil(totalCategories / limit),
    currentPage: Number(page),
    totalCategories
  };
};

// Get single category by ID
export const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId).populate('parent', 'name');
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};



// Update category
export const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if new name already exists (if name is being changed)
  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await Category.findOne({ name: updateData.name });
    if (existingCategory) {
      throw new ApiError(409, 'Category with this name already exists');
    }
  }

  Object.assign(category, updateData);
  await category.save();

  return category;
};

// Delete category
export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if category has child categories
  const childCategories = await Category.countDocuments({ parent: categoryId });
  if (childCategories > 0) {
    throw new ApiError(400, 'Cannot delete category with sub-categories. Delete sub-categories first.');
  }

  await Category.findByIdAndDelete(categoryId);
  return true;
};

// Create new category
export const createCategory = async (categoryData) => {
  console.log('🔧 Service: Creating category with:', categoryData); // 🔍 Debug log
  
  const { name, description, parent } = categoryData;

  // Validation
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    throw new ApiError(409, 'Category with this name already exists');
  }

  try {
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || '',
      parent: parent || null
    });

    console.log('✅ Category created:', category); // 🔍 Success log
    return category;
  } catch (error) {
    console.error('❌ Database error creating category:', error); // 🔍 DB error log
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ApiError(409, 'Category with this name already exists');
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, messages.join(', '));
    }
    
    throw error;
  }
};