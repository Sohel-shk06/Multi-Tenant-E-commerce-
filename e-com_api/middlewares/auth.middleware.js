import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const verifyJWT = async (req, res, next) => {
  try {
    // Token from Header (Bearer <token>) or Cookies
    const token = req.headers.authorization?.startsWith('Bearer ') 
      ? req.headers.authorization.split(' ')[1] 
      : req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -resetPasswordToken -verifyEmailToken');
    
    if (!user) {
      throw new ApiError(401, 'Invalid token: User not found');
    }

    // ✅ NEW: Check if user is suspended
    if (user.status === 'suspended') {
      throw new ApiError(403, 'Your account has been suspended. Please contact support.');
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    // ✅ Pass the actual error to next() instead of generic message
    next(error);
  }
};