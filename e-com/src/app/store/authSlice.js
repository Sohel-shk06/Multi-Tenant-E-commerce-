import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
  successMessage: null,
};

// --- Async Thunks ---

// ✅ Register User Thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data; // returns { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// ✅ Login User Thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      if (user.status === 'suspended') {
        return rejectWithValue('Your account has been suspended. Please contact support.');
      }
      
      if (user.status === 'pending') {
        return rejectWithValue('Your account is pending approval. Please wait for admin approval.');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue(error.response?.data?.message || 'Access denied');
      }
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Verify Email Thunk
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

// ✅ Change Password Thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword({ oldPassword, newPassword });
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// ✅ Forgot Password Thunk (Token Link based)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
    }
  }
);

// ✅ Reset Password Thunk (Token based)
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

// ✅ Request Email Change Thunk
export const requestEmailChange = createAsyncThunk(
  'auth/requestEmailChange',
  async (newEmail, { rejectWithValue }) => {
    try {
      const response = await authService.requestEmailChange(newEmail);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update email');
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
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ Register
      .addCase(registerUser.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, token } = action.payload || {};
        if (user && user.status === 'active') {
          state.user = user;
          state.token = token;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        state.successMessage = 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Login
      .addCase(loginUser.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Verify Email
      .addCase(verifyEmail.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successMessage = 'Email verified successfully!';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ✅ Change Password
      .addCase(changePassword.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Forgot Password
      .addCase(forgotPassword.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Reset Password
      .addCase(resetPassword.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Request Email Change
      .addCase(requestEmailChange.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(requestEmailChange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || 'Email updated successfully!';
        if (state.user && action.payload.data?.email) {
          state.user.email = action.payload.data.email;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;