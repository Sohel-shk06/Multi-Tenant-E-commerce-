import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

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
  
  // Password Reset Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Email Verification Tokens
  verifyEmailToken: String,
  verifyEmailExpire: Date,
}, { timestamps: true });

// 🔥 FIX: Mongoose 8+ mein async function mein 'next' pass nahi hota.
// Hum sirf 'return' use karenge.
userSchema.pre('save', async function() {
  // Agar password modify nahi hua hai, toh aage mat jao
  if (!this.isModified('password')) return;
  
  // Password ko Bcrypt se hash karein (SRS ke mutabiq >= 10 salt rounds)
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

export const User = mongoose.model('User', userSchema);