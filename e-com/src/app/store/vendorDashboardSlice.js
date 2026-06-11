import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendor.service';

const initialState = {
  stats: null,
  chartData: [],
  recentOrders: [],
  isLoading: false,
  error: null,
};

// Fetch Dashboard Stats
export const fetchVendorStats = createAsyncThunk(
  'vendorDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getDashboardStats();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Fetch Revenue Chart Data
export const fetchVendorRevenueChart = createAsyncThunk(
  'vendorDashboard/fetchRevenue',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getRevenueChart();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue chart');
    }
  }
);

// Fetch Recent Orders
export const fetchVendorRecentOrders = createAsyncThunk(
  'vendorDashboard/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getRecentOrders();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent orders');
    }
  }
);

const vendorDashboardSlice = createSlice({
  name: 'vendorDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchVendorStats.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchVendorStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchVendorStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Revenue Chart
    builder
      .addCase(fetchVendorRevenueChart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorRevenueChart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchVendorRevenueChart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Recent Orders
    builder
      .addCase(fetchVendorRecentOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVendorRecentOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchVendorRecentOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default vendorDashboardSlice.reducer;