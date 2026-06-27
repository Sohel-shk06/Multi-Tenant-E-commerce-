import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

// Helper to get initial state from localStorage
const getUserFromStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  successMessage: null,
};

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data; 
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data.user; 
    } catch (error) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data.message; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(token, newPassword);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const requestEmailChange = createAsyncThunk(
  'auth/requestEmailChange',
  async (newEmail, { rejectWithValue }) => {
    try {
      const response = await authService.requestEmailChange(newEmail);
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyEmailChange = createAsyncThunk(
  'auth/verifyEmailChange',
  async (otp, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmailChange(otp);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);


// ✅ FIXED: Change Password Thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {  // ✅ oldPassword use karein
    try {
      // ✅ Backend ko bhi oldPassword bhejein
      const response = await authService.changePassword({ oldPassword, newPassword });
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register Cases
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Current User Cases
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      
      // Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Reset Password Cases
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Request Email Change Cases
      .addCase(requestEmailChange.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
        state.successMessage = null;
      })
      .addCase(requestEmailChange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify Email Change Cases
      .addCase(verifyEmailChange.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
        state.successMessage = null;
      })
      .addCase(verifyEmailChange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Email updated successfully!';
        if (state.user) {
          state.user.email = action.payload.email;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(verifyEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ NEW: Change Password Cases
      .addCase(changePassword.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;