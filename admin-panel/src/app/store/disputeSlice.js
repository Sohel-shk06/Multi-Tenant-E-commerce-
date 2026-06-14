import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { disputeService } from '../../services/dispute.service';

const initialState = {
  disputes: [],
  currentDispute: null,
  analytics: null,
  statusCounts: {
    open: 0,
    under_review: 0,
    vendor_responded: 0,
    resolved_customer: 0,
    resolved_vendor: 0,
    closed: 0
  },
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
  isLoading: false,
  error: null,
};

export const fetchDisputes = createAsyncThunk(
  'disputes/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await disputeService.getDisputes(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch disputes');
    }
  }
);

export const fetchDispute = createAsyncThunk(
  'disputes/fetchOne',
  async (disputeId, { rejectWithValue }) => {
    try {
      return await disputeService.getDispute(disputeId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dispute');
    }
  }
);

export const resolveDispute = createAsyncThunk(
  'disputes/resolve',
  async ({ disputeId, data }, { rejectWithValue, dispatch }) => {
    try {
      const result = await disputeService.resolveDispute(disputeId, data);
      dispatch(fetchDisputes({ page: 1 }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve dispute');
    }
  }
);

export const updateDisputeStatus = createAsyncThunk(
  'disputes/updateStatus',
  async ({ disputeId, data }, { rejectWithValue, dispatch }) => {
    try {
      const result = await disputeService.updateDisputeStatus(disputeId, data);
      dispatch(fetchDisputes({ page: 1 }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const fetchDisputeAnalytics = createAsyncThunk(
  'disputes/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await disputeService.getDisputeAnalytics();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const disputeSlice = createSlice({
  name: 'disputes',
  initialState,
  reducers: {
    clearCurrentDispute: (state) => { state.currentDispute = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchDisputes.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disputes = action.payload.disputes;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalDisputes;
        state.statusCounts = action.payload.statusCounts;
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch One
      .addCase(fetchDispute.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDispute.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDispute = action.payload;
      })
      .addCase(fetchDispute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Resolve
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.currentDispute = action.payload;
      })
      
      // Analytics
      .addCase(fetchDisputeAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearCurrentDispute } = disputeSlice.actions;
export default disputeSlice.reducer;