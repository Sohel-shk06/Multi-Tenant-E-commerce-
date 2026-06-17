import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendor.service';

const initialState = {
  products: [],
  currentProduct: null, // ✅ NEW
  stores: [],
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  isLoading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchVendorProducts = createAsyncThunk(
  'vendorProducts/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const data = await vendorService.getVendorProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// ✅ NEW: Fetch single product for editing
export const fetchVendorProduct = createAsyncThunk(
  'vendorProducts/fetchOne',
  async (productId, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorProduct(productId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchVendorStores = createAsyncThunk(
  'vendorProducts/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorStores();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

export const createVendorProduct = createAsyncThunk(
  'vendorProducts/create',
  async (productData, { rejectWithValue }) => {
    try {
      return await vendorService.createVendorProduct(productData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// ✅ NEW: Update product thunk
export const updateVendorProduct = createAsyncThunk(
  'vendorProducts/update',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      return await vendorService.updateVendorProduct(productId, productData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteVendorProduct = createAsyncThunk(
  'vendorProducts/delete',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      await vendorService.deleteVendorProduct(productId);
      dispatch(fetchVendorProducts({ page: 1 }));
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const createVendorStore = createAsyncThunk(
  'vendorProducts/createStore',
  async (storeData, { rejectWithValue, dispatch }) => {
    try {
      const newStore = await vendorService.createStore(storeData);
      dispatch(fetchVendorStores());
      return newStore;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create store');
    }
  }
);

// ===== SLICE =====

const vendorProductSlice = createSlice({
  name: 'vendorProducts',
  initialState,
  reducers: {
    clearError: (state) => { 
      state.error = null; 
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    // FETCH PRODUCTS
    builder
      .addCase(fetchVendorProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ FETCH SINGLE PRODUCT
    builder
      .addCase(fetchVendorProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchVendorProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // FETCH STORES
    builder
      .addCase(fetchVendorStores.fulfilled, (state, action) => {
        state.stores = action.payload || [];
      })
      .addCase(fetchVendorStores.rejected, (state, action) => {
        state.error = action.payload;
      });

    // CREATE PRODUCT
    builder
      .addCase(createVendorProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
        state.totalProducts += 1;
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ UPDATE PRODUCT
    builder
      .addCase(updateVendorProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVendorProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // List mein product update karein
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(updateVendorProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // DELETE PRODUCT
    builder
      .addCase(deleteVendorProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.totalProducts -= 1;
      });

    // CREATE STORE
    builder
      .addCase(createVendorStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVendorStore.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createVendorStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct } = vendorProductSlice.actions;
export default vendorProductSlice.reducer;