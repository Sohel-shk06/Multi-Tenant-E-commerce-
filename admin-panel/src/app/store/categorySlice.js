import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/category.service';

const initialState = {
  categories: [],
  currentCategory: null,  // ✅ YE ADD KIYA
  totalPages: 1,
  currentPage: 1,
  totalCategories: 0,
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params, { rejectWithValue }) => {
    try {
      const data = await categoryService.getCategories(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategory = createAsyncThunk(  // ✅ YE ADD KIYA
  'categories/fetchCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await categoryService.getCategory(categoryId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue, dispatch }) => {
    try {
      const category = await categoryService.createCategory(categoryData);
      dispatch(fetchCategories({ page: 1 }));
      return category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(  // ✅ YE ADD KIYA
  'categories/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue, dispatch }) => {
    try {
      const category = await categoryService.updateCategory(categoryId, categoryData);
      dispatch(fetchCategories({ page: 1 }));
      return category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue, dispatch }) => {
    try {
      await categoryService.deleteCategory(categoryId);
      dispatch(fetchCategories({ page: 1 }));
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCategories = action.payload.totalCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ fetchCategory (single)
      .addCase(fetchCategory.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ updateCategory
      .addCase(updateCategory.pending, (state) => { state.isLoading = true; })
      .addCase(updateCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;