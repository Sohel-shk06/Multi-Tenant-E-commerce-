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