// import crypto from 'crypto';
// import { User } from '../models/User.js';
// import { ApiError } from '../utils/ApiError.js';

// export const registerUser = async (userData) => {
//   const { name, email, password, role } = userData;
  
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new ApiError(409, 'User with this email already exists');
//   }

//   // SRS: Admin cannot be registered via public API (Security)
//   if (role === 'admin') {
//      throw new ApiError(403, 'Admin registration is not allowed');
//   }

//   const user = await User.create({ name, email, password, role: role || 'customer' });
  
//   // Generate Email Verification Token
//   const verifyToken = crypto.randomBytes(20).toString('hex');
//   user.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
//   user.verifyEmailExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   await user.save({ validateBeforeSave: false });

//   // TODO: Send verification email using Nodemailer
  
//   return { user, verifyToken };
// };

// export const loginUser = async (credentials) => {
//   const { email, password } = credentials;
  
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(401, 'Invalid email or password');
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     throw new ApiError(401, 'Invalid email or password');
//   }

//   const token = user.getJwtToken();
//   return { user, token };
// };

// export const forgotPasswordService = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, 'User with this email does not exist');
//   }

//   const resetToken = crypto.randomBytes(20).toString('hex');
//   user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//   user.resetPasswordExpire = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
//   await user.save({ validateBeforeSave: false });

//   // TODO: Send reset email with link: `${CLIENT_URL}/reset-password/${resetToken}`
//   return resetToken;
// };

// export const resetPasswordService = async (token, newPassword) => {
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
//   const user = await User.findOne({ 
//     resetPasswordToken: hashedToken, 
//     resetPasswordExpire: { $gt: Date.now() } 
//   });

//   if (!user) {
//     throw new ApiError(400, 'Invalid or expired reset token');
//   }

//   user.password = newPassword;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   return true;
// };


// // ... (existing code: registerUser, loginUser, forgotPasswordService, resetPasswordService)

// export const verifyEmailService = async (token) => {
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
//   const user = await User.findOne({ 
//     verifyEmailToken: hashedToken, 
//     verifyEmailExpire: { $gt: Date.now() } 
//   });

//   if (!user) {
//     throw new ApiError(400, 'Invalid or expired verification token');
//   }

//   user.isVerified = true;
//   user.verifyEmailToken = undefined;
//   user.verifyEmailExpire = undefined;
//   await user.save({ validateBeforeSave: false });

//   return user;
// };

// export const resendVerificationService = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, 'User with this email does not exist');
//   }
//   if (user.isVerified) {
//     throw new ApiError(400, 'Email is already verified');
//   }

//   const verifyToken = crypto.randomBytes(20).toString('hex');
//   user.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
//   user.verifyEmailExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   await user.save({ validateBeforeSave: false });

//   // TODO: Yahan Nodemailer se email bhejne ka code aayega
//   console.log(`📧 Verification Link: ${config.CLIENT_URL}/verify-email/${verifyToken}`);
  
//   return verifyToken;
// };

// export const changePasswordService = async (userId, oldPassword, newPassword) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(404, 'User not found');
//   }

//   const isMatch = await user.comparePassword(oldPassword);
//   if (!isMatch) {
//     throw new ApiError(401, 'Incorrect old password');
//   }

//   // Validate new password
//   if (newPassword.length < 8) {
//     throw new ApiError(400, 'New password must be at least 8 characters');
//   }

//   user.password = newPassword; // pre-save hook automatically hash karega
//   await user.save();

//   return true;
// };





import crypto from 'crypto';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { sendOtpEmail } from '../utils/mailer.js';

// ✅ UPDATED: Register User - OTP Generate Kare
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  if (role === 'admin') {
     throw new ApiError(403, 'Admin registration is not allowed');
  }

  // 6-digit OTP generate karein
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  // User ko pending state mein create karein
  const user = await User.create({ 
    name, 
    email, 
    password, 
    role: role || 'customer',
    status: 'pending',
    isVerified: false,
    registrationOtp: hashedOtp,
    registrationOtpExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  
  // Email bhejein
  try {
    await sendOtpEmail(email, otp, 'Account Registration');
    console.log(`✅ Registration OTP sent to ${email}`);
    console.log(`🔑 DEVELOPMENT OTP: ${otp}`);
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new ApiError(500, 'Failed to send OTP email');
  }

  return { message: 'OTP sent successfully. Please verify to complete registration.' };
};

// ✅ NEW: Verify Registration OTP
export const verifyRegistrationOtpService = async (email, otp) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  const user = await User.findOne({ 
    email,
    registrationOtp: hashedOtp, 
    registrationOtpExpire: { $gt: Date.now() } 
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // User ko active karein
  user.isVerified = true;
  user.status = 'active';
  user.registrationOtp = undefined;
  user.registrationOtpExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Token generate karein
  const token = user.getJwtToken();

  return { user, token };
};

// ✅ NEW: Resend Registration OTP
export const resendRegistrationOtpService = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isVerified) {
    throw new ApiError(400, 'Email is already verified');
  }

  // 6-digit OTP generate karein
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  user.registrationOtp = hashedOtp;
  user.registrationOtpExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Email bhejein
  try {
    await sendOtpEmail(email, otp, 'Account Registration');
    console.log(`✅ Registration OTP resent to ${email}`);
    console.log(`🔑 DEVELOPMENT OTP: ${otp}`);
  } catch (error) {
    throw new ApiError(500, 'Failed to resend OTP email');
  }

  return { message: 'OTP resent successfully' };
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

// ... existing code ...

// ✅ UPDATED: Forgot Password - OTP Generate Kare
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  // 6-digit OTP generate karein
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  user.resetPasswordToken = hashedOtp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Email bhejein
  try {
    await sendOtpEmail(email, otp, 'Password Reset');
    console.log(`✅ Password reset OTP sent to ${email}`);
    console.log(`🔑 DEVELOPMENT OTP: ${otp}`);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Failed to send OTP email');
  }

  return { message: 'OTP sent successfully' };
};

// ✅ NEW: Verify Reset OTP
export const verifyResetOtpService = async (email, otp) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  const user = await User.findOne({ 
    email,
    resetPasswordToken: hashedOtp, 
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  return { message: 'OTP verified successfully' };
};

// ✅ NEW: Reset Password with OTP
export const resetPasswordWithOtpService = async (email, otp, newPassword) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  const user = await User.findOne({ 
    email,
    resetPasswordToken: hashedOtp, 
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  return { message: 'Password reset successfully' };
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
  console.log('=== DEBUG: changePasswordService ===');
  console.log('userId:', userId);
  console.log('oldPassword type:', typeof oldPassword, '| value:', oldPassword ? '***' : 'UNDEFINED/EMPTY');
  console.log('newPassword type:', typeof newPassword, '| value:', newPassword ? '***' : 'UNDEFINED/EMPTY');
  
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  console.log('user.password exists?', !!user.password);
  console.log('user.password type:', typeof user.password);
  console.log('user.password length:', user.password?.length);

  if (!user.password) {
    throw new ApiError(500, 'User password is missing in database');
  }

  if (!oldPassword) {
    throw new ApiError(400, 'Old password is required');
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect old password');
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return true;
};



export const requestEmailChangeService = async (userId, newEmail) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.email === newEmail) {
    throw new ApiError(400, 'New email cannot be the same as current email');
  }

  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    throw new ApiError(409, 'This email is already registered with another account');
  }

  // 6-digit OTP generate karein
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  // Database mein save karein
  user.pendingEmail = newEmail;
  user.emailChangeOtp = hashedOtp;
  user.emailChangeOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes valid
  await user.save({ validateBeforeSave: false });

  // ✅ Email bhejein
  try {
    await sendOtpEmail(newEmail, otp, 'Email Change Request');
    console.log(`✅ OTP sent to ${newEmail}`);
  } catch (error) {
    // Agar email fail ho jaye toh OTP clear kar dein
    user.pendingEmail = null;
    user.emailChangeOtp = null;
    user.emailChangeOtpExpire = null;
    await user.save({ validateBeforeSave: false });
    
    throw new ApiError(500, 'Failed to send OTP email. Please try again.');
  }

  return { message: 'OTP sent successfully to new email' };
};

// ✅ NEW: Email Change Verify Service (Step 2: OTP Verify & Update Email)
export const verifyEmailChangeService = async (userId, otp) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check: Kya user ne OTP request kiya tha?
  if (!user.pendingEmail || !user.emailChangeOtp) {
    throw new ApiError(400, 'No email change request found. Please request OTP first.');
  }

  // Check: OTP expire toh nahi ho gaya?
  if (user.emailChangeOtpExpire < Date.now()) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.');
  }

  // Check: OTP sahi hai ya galat?
  if (user.emailChangeOtp !== hashedOtp) {
    throw new ApiError(400, 'Invalid OTP. Please try again.');
  }

  // Sab sahi hai! Email update karein
  user.email = user.pendingEmail;
  user.isVerified = true; // Naya email already verified maan rahe hain kyunki OTP wahi gaya tha
  
  // OTP fields clear karein
  user.pendingEmail = null;
  user.emailChangeOtp = null;
  user.emailChangeOtpExpire = null;
  
  await user.save({ validateBeforeSave: false });

  return { email: user.email };
};