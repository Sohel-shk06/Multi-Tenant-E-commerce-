import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

// Simplified Register - No OTP
export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  return res.status(201).json(new ApiResponse(201, { user, token }, 'Registration successful'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  return res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, 'User fetched successfully'));
});

// Simplified Forgot Password - Token based
export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPasswordService(req.body.email);
  return res.status(200).json(new ApiResponse(200, null, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPasswordService(req.params.token, req.body.newPassword);
  return res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});

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

// Simplified Email Change - No OTP
export const requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  const result = await authService.requestEmailChangeService(req.user._id, newEmail);
  return res.status(200).json(new ApiResponse(200, { email: result.email }, result.message));
});