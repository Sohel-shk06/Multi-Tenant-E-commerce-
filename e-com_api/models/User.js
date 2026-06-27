// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { config } from '../config/env.js';

// // ✅ Address sub-schema
// const addressSchema = new mongoose.Schema({
//   label: { 
//     type: String, 
//     default: 'Home',
//     enum: ['Home', 'Work', 'Other']
//   },
//   fullName: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   zipCode: { type: String, required: true },
//   country: { type: String, default: 'India' },
//   isDefault: { type: Boolean, default: false }
// }, { timestamps: true });

// // ✅ Business Info sub-schema (NEW - Vendor Settings ke liye)
// const businessInfoSchema = new mongoose.Schema({
//   businessName: { type: String, default: '' },
//   gstNumber: { type: String, default: '' },
//   panNumber: { type: String, default: '' },
//   businessAddress: {
//     address: { type: String, default: '' },
//     city: { type: String, default: '' },
//     state: { type: String, default: '' },
//     zipCode: { type: String, default: '' },
//     country: { type: String, default: 'India' }
//   },
//   bankDetails: {
//     accountHolder: { type: String, default: '' },
//     accountNumber: { type: String, default: '' },
//     ifscCode: { type: String, default: '' },
//     bankName: { type: String, default: '' }
//   }
// }, { _id: false });

// // ✅ Notification Preferences sub-schema (NEW)
// const notificationPreferencesSchema = new mongoose.Schema({
//   emailNotifications: { type: Boolean, default: true },
//   orderUpdates: { type: Boolean, default: true },
//   newReviews: { type: Boolean, default: true },
//   payoutUpdates: { type: Boolean, default: true },
//   promotionalEmails: { type: Boolean, default: false },
//   lowStockAlerts: { type: Boolean, default: true }
// }, { _id: false });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 8 },
//   role: { 
//     type: String, 
//     enum: ['admin', 'vendor', 'customer'], 
//     default: 'customer' 
//   },

//   status: {
//     type: String,
//     enum: ['pending', 'active', 'suspended'],
//     default: function() {
//       return this.role === 'vendor' ? 'pending' : 'active';
//     }
//   },
//   isVerified: { type: Boolean, default: false },
//   avatar: { type: String, default: '' },
//   phone: { type: String, default: '' },
  
//   // ✅ Address book
//   addresses: [addressSchema],
  
//   // ✅ NEW: Business Info (Vendor ke liye)
//   businessInfo: { 
//     type: businessInfoSchema, 
//     default: () => ({}) 
//   },
  
//   // ✅ NEW: Notification Preferences
//   notificationPreferences: { 
//     type: notificationPreferencesSchema, 
//     default: () => ({}) 
//   },
  
//   // Password Reset Tokens
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,

//   // Email Verification Tokens
//   verifyEmailToken: String,
//   verifyEmailExpire: Date,
// }, { timestamps: true });

// // 🔥 FIX: Mongoose 8+ mein async function mein 'next' pass nahi hota.
// userSchema.pre('save', async function() {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// userSchema.methods.comparePassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.getJwtToken = function() {
//   return jwt.sign({ id: this._id, role: this.role }, config.JWT_SECRET, {
//     expiresIn: config.JWT_EXPIRE,
//   });
// };

// export const User = mongoose.model('User', userSchema);




import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// ✅ Address sub-schema
const addressSchema = new mongoose.Schema({
  label: { 
    type: String, 
    default: 'Home',
    enum: ['Home', 'Work', 'Other']
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

// ✅ Business Info sub-schema (NEW - Vendor Settings ke liye)
const businessInfoSchema = new mongoose.Schema({
  businessName: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  businessAddress: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  bankDetails: {
    accountHolder: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' }
  }
}, { _id: false });

// ✅ Notification Preferences sub-schema (NEW)
const notificationPreferencesSchema = new mongoose.Schema({
  emailNotifications: { type: Boolean, default: true },
  orderUpdates: { type: Boolean, default: true },
  newReviews: { type: Boolean, default: true },
  payoutUpdates: { type: Boolean, default: true },
  promotionalEmails: { type: Boolean, default: false },
  lowStockAlerts: { type: Boolean, default: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { 
    type: String, 
    enum: ['admin', 'vendor', 'customer'], 
    default: 'customer' 
  },

  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: function() {
      return this.role === 'vendor' ? 'pending' : 'active';
    }
  },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  
  // ✅ Address book
  addresses: [addressSchema],
  
  // ✅ NEW: Business Info (Vendor ke liye)
  businessInfo: { 
    type: businessInfoSchema, 
    default: () => ({}) 
  },
  
  // ✅ NEW: Notification Preferences
  notificationPreferences: { 
    type: notificationPreferencesSchema, 
    default: () => ({}) 
  },
  
  // Password Reset Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Email Verification Tokens
  verifyEmailToken: String,
  verifyEmailExpire: Date,

  // ✅ NEW: Email Change OTP Fields (Admin/Any User email change ke liye)
  pendingEmail: { type: String, default: null },
  emailChangeOtp: { type: String, default: null },
  emailChangeOtpExpire: { type: Date, default: null },

}, { timestamps: true });

// 🔥 FIX: Mongoose 8+ mein async function mein 'next' pass nahi hota.
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

export const User = mongoose.model('User', userSchema);