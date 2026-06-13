import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/product.service';

const initialState = {
  products: [],
  currentProduct: null, // ✅ YE ADD KAREIN
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const product = await productService.getProduct(productId);
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const product = await productService.createProduct(productData);
      dispatch(fetchProducts({ page: 1 }));
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue, dispatch }) => {
    try {
      const product = await productService.updateProduct(productId, productData);
      dispatch(fetchProducts({ page: 1 }));
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      await productService.deleteProduct(productId);
      dispatch(fetchProducts({ page: 1 }));
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateStatus',
  async ({ productId, status }, { rejectWithValue, dispatch }) => {
    try {
      await productService.updateProductStatus(productId, status);
      dispatch(fetchProducts({ page: 1 }));
      return { productId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const fetchProductsForModeration = createAsyncThunk(
  'products/fetchForModeration',
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProductsForModeration(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products for moderation');
    }
  }
);

export const moderateProduct = createAsyncThunk(
  'products/moderate',
  async ({ productId, action, notes }, { rejectWithValue, dispatch }) => {
    try {
      await productService.moderateProduct(productId, action, notes);
      dispatch(fetchProductsForModeration({ page: 1 }));
      return { productId, action };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to moderate product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ fetchProduct (single product)
      .addCase(fetchProduct.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ updateProduct
      .addCase(updateProduct.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ fetchProductsForModeration
      .addCase(fetchProductsForModeration.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(fetchProductsForModeration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProductsForModeration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ moderateProduct
      .addCase(moderateProduct.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(moderateProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(moderateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;