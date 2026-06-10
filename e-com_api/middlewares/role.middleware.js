import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role ${req.user.role} is not allowed to access this resource`));
    }
    next();
  };
};