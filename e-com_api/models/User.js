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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { 
    type: String, 
    enum: ['admin', 'vendor', 'customer'], 
    default: 'customer' 
  },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' }, // ✅ Added phone field
  
  // ✅ Address book
  addresses: [addressSchema],
  
  // Password Reset Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Email Verification Tokens
  verifyEmailToken: String,
  verifyEmailExpire: Date,
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