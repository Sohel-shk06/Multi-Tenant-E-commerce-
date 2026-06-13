import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '../../services/payment.service';

const initialState = {
  transactions: [],
  payouts: [],
  currentTransaction: null,
  analytics: null,
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      return await paymentService.getTransactions(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransaction = createAsyncThunk(
  'payments/fetchTransaction',
  async (paymentId, { rejectWithValue }) => {
    try {
      return await paymentService.getTransaction(paymentId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

export const fetchPayouts = createAsyncThunk(
  'payments/fetchPayouts',
  async (params, { rejectWithValue }) => {
    try {
      return await paymentService.getPayouts(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payouts');
    }
  }
);

export const updatePayoutStatus = createAsyncThunk(
  'payments/updatePayoutStatus',
  async ({ payoutId, data }, { rejectWithValue, dispatch }) => {
    try {
      const result = await paymentService.updatePayoutStatus(payoutId, data);
      dispatch(fetchPayouts({ page: 1 }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payout');
    }
  }
);

export const fetchPaymentAnalytics = createAsyncThunk(
  'payments/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPaymentAnalytics();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Transactions
      .addCase(fetchTransactions.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalTransactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Single Transaction
      .addCase(fetchTransaction.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Payouts
      .addCase(fetchPayouts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payouts = action.payload.payouts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalPayouts;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Analytics
      .addCase(fetchPaymentAnalytics.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPaymentAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchPaymentAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;