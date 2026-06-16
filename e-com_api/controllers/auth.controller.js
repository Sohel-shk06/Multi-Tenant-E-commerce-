import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, verifyToken } = await authService.registerUser(req.body);
  return res.status(201).json(new ApiResponse(201, { user, verifyToken }, 'User registered successfully. Please verify your email.'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  return res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, 'User fetched successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.forgotPasswordService(req.body.email);
  return res.status(200).json(new ApiResponse(200, { resetToken }, 'Password reset link sent to your email'));
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