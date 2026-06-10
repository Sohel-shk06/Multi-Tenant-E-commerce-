import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analytics.service';

const initialState = {
  stats: null,
  revenueChartData: [],
  isLoading: false,
  error: null,
};

// Fetch Dashboard Stats
export const fetchAdminDashboardStats = createAsyncThunk(
  'analytics/fetchAdminDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getAdminDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Fetch Chart Data
export const fetchRevenueChartData = createAsyncThunk(
  'analytics/fetchRevenueChartData',
  async (timeframe, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getRevenueChart(timeframe);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardStats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRevenueChartData.fulfilled, (state, action) => {
        state.revenueChartData = action.payload;
      });
  }
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;