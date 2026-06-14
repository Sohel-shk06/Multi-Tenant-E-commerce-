import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commissionService } from '../../services/commission.service';

const initialState = {
  commissions: [],
  currentCommission: null,
  analytics: null,
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
  isLoading: false,
  error: null,
};

export const fetchCommissions = createAsyncThunk(
  'commissions/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await commissionService.getCommissions(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commissions');
    }
  }
);

export const fetchCommission = createAsyncThunk(
  'commissions/fetchOne',
  async (commissionId, { rejectWithValue }) => {
    try {
      return await commissionService.getCommission(commissionId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commission');
    }
  }
);

export const updateCommissionStatus = createAsyncThunk(
  'commissions/updateStatus',
  async ({ commissionId, data }, { rejectWithValue, dispatch }) => {
    try {
      const result = await commissionService.updateCommissionStatus(commissionId, data);
      dispatch(fetchCommissions({ page: 1 }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update commission');
    }
  }
);

export const fetchCommissionAnalytics = createAsyncThunk(
  'commissions/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await commissionService.getCommissionAnalytics();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const commissionSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Commissions List
      .addCase(fetchCommissions.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = action.payload.commissions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalCommissions;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Single Commission
      .addCase(fetchCommission.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCommission = action.payload;
      })
      .addCase(fetchCommission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Analytics
      .addCase(fetchCommissionAnalytics.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCommissionAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchCommissionAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default commissionSlice.reducer;