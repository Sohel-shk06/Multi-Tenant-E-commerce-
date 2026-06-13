import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';

// ===== Get User Profile =====
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('-password -resetPasswordToken -resetPasswordExpire -verifyEmailToken -verifyEmailExpire');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

// ===== Update User Profile =====
export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if email is being changed and already exists
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      throw new ApiError(409, 'Email already in use');
    }
  }

  // Update allowed fields
  const allowedFields = ['name', 'email', 'phone', 'avatar'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();
  
  // Return without sensitive fields
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;
  delete userObj.verifyEmailToken;
  delete userObj.verifyEmailExpire;
  
  return userObj;
};

// ===== Change Password =====
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

// ===== Address Book Management =====

// Get all addresses
export const getUserAddresses = async (userId) => {
  const user = await User.findById(userId).select('addresses');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.addresses || [];
};

// Add new address
export const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Validate required fields
  const { fullName, phone, address, city, state, zipCode } = addressData;
  if (!fullName || !phone || !address || !city || !state || !zipCode) {
    throw new ApiError(400, 'All address fields are required');
  }

  // If this is set as default, unset others
  if (addressData.isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }

  // If no addresses exist, make this one default
  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();

  return user.addresses;
};

// Update address
export const updateAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  // If setting as default, unset others
  if (addressData.isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }

  // Update fields
  Object.keys(addressData).forEach(key => {
    if (addressData[key] !== undefined) {
      address[key] = addressData[key];
    }
  });

  await user.save();
  return user.addresses;
};

// Delete address
export const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const wasDefault = address.isDefault;
  user.addresses.pull(addressId);

  // If deleted address was default and others exist, make first one default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return user.addresses;
};