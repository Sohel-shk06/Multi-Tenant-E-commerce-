import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/order.service';

const initialState = {
  orders: [],
  order: null, // ✅ Single order ke liye add kiya
  totalPages: 1,
  currentPage: 1,
  totalOrders: 0,
  isLoading: false,
  error: null,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrders(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// ✅ FIX: Fetch single order by ID
export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrder(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      // Status update ke baad list refresh karein
      dispatch(fetchOrders({ page: 1 }));
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ FIX: Get Order Cases
      .addCase(getOrder.pending, (state) => { state.isLoading = true; })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state) => {
        // List already refresh ho jayegi dispatch ke through
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;