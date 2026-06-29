import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeService } from '../../services/store.service';

const initialState = {
  stores: [],
  currentStore: null,
  storeAnalytics: null,
  totalPages: 1,
  currentPage: 1,
  totalStores: 0,
  isLoading: false,
  error: null,
};

export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (params, { rejectWithValue }) => {
    try {
      return await storeService.getStores(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

// ✅ NEW: Fetch single store
export const fetchStore = createAsyncThunk(
  'stores/fetchStore',
  async (storeId, { rejectWithValue }) => {
    try {
      return await storeService.getStore(storeId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch store');
    }
  }
);

// ✅ UPDATED: Create store with FormData
export const createStore = createAsyncThunk(
  'stores/createStore',
  async (storeData, { rejectWithValue, dispatch }) => {
    try {
      const store = await storeService.createStore(storeData);
      dispatch(fetchStores({ page: 1 }));
      return store;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create store');
    }
  }
);

// ✅ UPDATED: Update store with FormData
export const updateStore = createAsyncThunk(
  'stores/updateStore',
  async ({ storeId, storeData }, { rejectWithValue, dispatch }) => {
    try {
      const store = await storeService.updateStore(storeId, storeData);
      dispatch(fetchStores({ page: 1 }));
      return store;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update store');
    }
  }
);

export const deleteStore = createAsyncThunk(
  'stores/deleteStore',
  async (storeId, { rejectWithValue, dispatch }) => {
    try {
      await storeService.deleteStore(storeId);
      dispatch(fetchStores({ page: 1 }));
      return storeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
    }
  }
);

// ✅ NEW: Fetch store analytics
export const fetchStoreAnalytics = createAsyncThunk(
  'stores/fetchAnalytics',
  async (storeId, { rejectWithValue }) => {
    try {
      return await storeService.getStoreAnalytics(storeId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearCurrentStore: (state) => { state.currentStore = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all stores
      .addCase(fetchStores.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stores = action.payload.stores;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalStores = action.payload.totalStores;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Fetch single store
      .addCase(fetchStore.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Update store
      .addCase(updateStore.pending, (state) => { state.isLoading = true; })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Store analytics
      .addCase(fetchStoreAnalytics.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStoreAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeAnalytics = action.payload;
      })
      .addCase(fetchStoreAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;