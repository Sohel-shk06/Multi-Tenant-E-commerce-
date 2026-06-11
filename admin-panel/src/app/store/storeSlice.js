import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeService } from '../../services/store.service';

const initialState = {
  stores: [],
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

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default storeSlice.reducer;