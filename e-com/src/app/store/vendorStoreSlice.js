import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendor.service';

const initialState = {
  stores: [],
  currentStore: null,
  totalPages: 1,
  currentPage: 1,
  totalStores: 0,
  isLoading: false,
  error: null,
};

export const fetchVendorStoresFull = createAsyncThunk(
  'vendorStores/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorStoresFull(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

export const fetchVendorStore = createAsyncThunk(
  'vendorStores/fetchOne',
  async (storeId, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorStore(storeId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch store');
    }
  }
);

export const updateVendorStore = createAsyncThunk(
  'vendorStores/update',
  async ({ storeId, storeData }, { rejectWithValue }) => {
    try {
      return await vendorService.updateVendorStore(storeId, storeData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update store');
    }
  }
);

export const deleteVendorStore = createAsyncThunk(
  'vendorStores/delete',
  async (storeId, { rejectWithValue, dispatch }) => {
    try {
      await vendorService.deleteVendorStore(storeId);
      dispatch(fetchVendorStoresFull({ page: 1 }));
      return storeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
    }
  }
);

const vendorStoreSlice = createSlice({
  name: 'vendorStores',
  initialState,
  reducers: {
    clearCurrentStore: (state) => { state.currentStore = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchVendorStoresFull.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorStoresFull.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stores = action.payload.stores || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalStores = action.payload.totalStores || 0;
      })
      .addCase(fetchVendorStoresFull.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchVendorStore.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchVendorStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateVendorStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.stores[index] = action.payload;
        state.currentStore = action.payload;
      })
      // Delete
      .addCase(deleteVendorStore.fulfilled, (state, action) => {
        state.stores = state.stores.filter(s => s._id !== action.payload);
        state.totalStores -= 1;
      });
  },
});

export const { clearCurrentStore, clearError } = vendorStoreSlice.actions;
export default vendorStoreSlice.reducer;