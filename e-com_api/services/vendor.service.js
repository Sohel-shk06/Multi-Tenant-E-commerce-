import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// Get all vendors with search and pagination
export const getAllVendors = async (query) => {
  const { search, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const filter = { role: 'vendor' };
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const vendors = await User.find(filter)
    .select('-password -resetPasswordToken -verifyEmailToken')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalVendors = await User.countDocuments(filter);

  return {
    vendors,
    totalPages: Math.ceil(totalVendors / limit),
    currentPage: Number(page),
    totalVendors
  };
};

// Update vendor status (Active / Suspended)
export const updateVendorStatus = async (vendorId, status) => {
  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== 'vendor') {
    throw new ApiError(404, 'Vendor not found');
  }

  vendor.status = status; // Ensure 'status' field exists in User model
  await vendor.save();
  
  return vendor;
};

// Admin creates a new vendor manually
export const createVendorByAdmin = async (vendorData) => {
  const { name, email, password, storeName } = vendorData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const newVendor = await User.create({
    name,
    email,
    password,
    role: 'vendor',
    status: 'active',
    isVerified: true // Admin created vendors are auto-verified
  });

  return newVendor;
};