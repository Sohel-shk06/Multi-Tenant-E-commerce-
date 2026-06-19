import crypto from 'crypto';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // SRS: Admin cannot be registered via public API (Security)
  if (role === 'admin') {
     throw new ApiError(403, 'Admin registration is not allowed');
  }

  const user = await User.create({ name, email, password, role: role || 'customer' });
  
  // Generate Email Verification Token
  const verifyToken = crypto.randomBytes(20).toString('hex');
  user.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.verifyEmailExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email using Nodemailer
  
  return { user, verifyToken };
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = user.getJwtToken();
  return { user, token };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset email with link: `${CLIENT_URL}/reset-password/${resetToken}`
  return resetToken;
};

export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({ 
    resetPasswordToken: hashedToken, 
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return true;
};


// ... (existing code: registerUser, loginUser, forgotPasswordService, resetPasswordService)

export const verifyEmailService = async (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({ 
    verifyEmailToken: hashedToken, 
    verifyEmailExpire: { $gt: Date.now() } 
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verifyEmailToken = undefined;
  user.verifyEmailExpire = undefined;
  await user.save({ validateBeforeSave: false });

  return user;
};

export const resendVerificationService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }
  if (user.isVerified) {
    throw new ApiError(400, 'Email is already verified');
  }

  const verifyToken = crypto.randomBytes(20).toString('hex');
  user.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.verifyEmailExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save({ validateBeforeSave: false });

  // TODO: Yahan Nodemailer se email bhejne ka code aayega
  console.log(`📧 Verification Link: ${config.CLIENT_URL}/verify-email/${verifyToken}`);
  
  return verifyToken;
};

export const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect old password');
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters');
  }

  user.password = newPassword; // pre-save hook automatically hash karega
  await user.save();

  return true;
};