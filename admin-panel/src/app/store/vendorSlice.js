import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendor.service';

const initialState = {
  vendors: [],
  selectedVendor: null,
  totalPages: 1,
  currentPage: 1,
  totalVendors: 0,
  isLoading: false,
  error: null,
};

export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (params, { rejectWithValue }) => {
    try {
      const data = await vendorService.getVendors(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchVendorById',
  async (vendorId, { rejectWithValue }) => {
    try {
      const data = await vendorService.getVendorById(vendorId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor');
    }
  }
);

export const updateVendorStatus = createAsyncThunk(
  'vendors/updateStatus',
  async ({ vendorId, status }, { rejectWithValue, dispatch }) => {
    try {
      await vendorService.updateVendorStatus(vendorId, status);
      dispatch(fetchVendors({ page: 1 }));
      return status;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchVendors
      .addCase(fetchVendors.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload.vendors;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalVendors = action.payload.totalVendors;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // fetchVendorById
      .addCase(fetchVendorById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default vendorSlice.reducer;