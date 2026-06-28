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
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// ✅ Verify Registration OTP Thunk
export const verifyRegistrationOtp = createAsyncThunk(
  'auth/verifyRegistrationOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyRegistrationOtp(email, otp);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

// ✅ Resend Registration OTP Thunk
export const resendRegistrationOtp = createAsyncThunk(
  'auth/resendRegistrationOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendRegistrationOtp(email);
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
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
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch (error) {
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

// ✅ Forgot Password Thunk (OTP based)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// ✅ Verify Reset OTP Thunk
export const verifyResetOtp = createAsyncThunk(
  'auth/verifyResetOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyResetOtp(email, otp);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

// ✅ Reset Password with OTP Thunk
export const resetPasswordWithOtp = createAsyncThunk(
  'auth/resetPasswordWithOtp',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPasswordWithOtp(email, otp, newPassword);
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
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// ✅ Verify Email Change Thunk
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
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'OTP sent! Please check your email to verify.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Verify Registration OTP
      .addCase(verifyRegistrationOtp.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(verifyRegistrationOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = 'Registration successful!';
      })
      .addCase(verifyRegistrationOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Resend Registration OTP
      .addCase(resendRegistrationOtp.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(resendRegistrationOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(resendRegistrationOtp.rejected, (state, action) => {
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

      // ✅ Verify Reset OTP
      .addCase(verifyResetOtp.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Reset Password with OTP
      .addCase(resetPasswordWithOtp.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(resetPasswordWithOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPasswordWithOtp.rejected, (state, action) => {
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
        state.successMessage = action.payload;
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Verify Email Change
      .addCase(verifyEmailChange.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
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
      });  // ✅ SIRF YAHAN SEMICOLON HONA CHAHIYE (last case ke baad)
  },
});

export const { logout, clearError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;