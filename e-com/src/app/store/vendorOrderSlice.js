import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendor.service';

const initialState = {
  orders: [],
  currentOrder: null,
  totalPages: 1,
  currentPage: 1,
  totalOrders: 0,
  isLoading: false,
  error: null,
};

export const fetchVendorOrders = createAsyncThunk(
  'vendorOrders/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorOrders(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchVendorOrder = createAsyncThunk(
  'vendorOrders/fetchOne',
  async (orderId, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateVendorOrderStatus = createAsyncThunk(
  'vendorOrders/updateStatus',
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      const updatedOrder = await vendorService.updateVendorOrderStatus(orderId, status);
      // Refresh list after status update
      dispatch(fetchVendorOrders({ page: 1 }));
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const vendorOrderSlice = createSlice({
  name: 'vendorOrders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchVendorOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalOrders = action.payload.totalOrders || 0;
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchVendorOrder.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchVendorOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateVendorOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearCurrentOrder } = vendorOrderSlice.actions;
export default vendorOrderSlice.reducer;