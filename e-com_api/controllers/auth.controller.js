import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

// ✅ UPDATED: Register
export const register = asyncHandler(async (req, res) => {
  await authService.registerUser(req.body);
  return res.status(200).json(new ApiResponse(200, null, 'OTP sent to your email. Please verify to complete registration.'));
});

// ✅ NEW: Verify Registration OTP
export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const { user, token } = await authService.verifyRegistrationOtpService(email, otp);
  return res.status(200).json(new ApiResponse(200, { user, token }, 'Registration successful'));
});

// ✅ NEW: Resend Registration OTP
export const resendRegistrationOtp = asyncHandler(async (req, res) => {
  await authService.resendRegistrationOtpService(req.body.email);
  return res.status(200).json(new ApiResponse(200, null, 'OTP resent successfully'));
});



export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  return res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, 'User fetched successfully'));
});

// ... existing code ...

// ✅ UPDATED: Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPasswordService(req.body.email);
  return res.status(200).json(new ApiResponse(200, null, 'OTP sent to your email'));
});

// ✅ NEW: Verify Reset OTP
export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyResetOtpService(email, otp);
  return res.status(200).json(new ApiResponse(200, null, 'OTP verified successfully'));
});

// ✅ NEW: Reset Password with OTP
export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPasswordWithOtpService(email, otp, newPassword);
  return res.status(200).json(new ApiResponse(200, null, 'Password reset successfully'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPasswordService(req.params.token, req.body.newPassword);
  return res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});

// ... (existing imports and controllers)

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmailService(req.params.token);
  return res.status(200).json(new ApiResponse(200, { user }, 'Email verified successfully'));
});

export const resendVerification = asyncHandler(async (req, res) => {
  const token = await authService.resendVerificationService(req.body.email);
  return res.status(200).json(new ApiResponse(200, { token }, 'Verification email resent successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePasswordService(req.user._id, oldPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});


export const requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  await authService.requestEmailChangeService(req.user._id, newEmail);
  return res.status(200).json(new ApiResponse(200, null, 'OTP sent to new email address'));
});

export const verifyEmailChange = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const { email } = await authService.verifyEmailChangeService(req.user._id, otp);
  return res.status(200).json(new ApiResponse(200, { email }, 'Email updated successfully'));
});