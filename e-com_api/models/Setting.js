import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,  // ✅ Yeh already index banata hai automatically
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'security', 'commission', 'payment', 'email', 'notification', 'storage', 'system'],
    required: true,
    index: true  // ✅ Category par index (yeh sahi hai)
  },
  description: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// ✅ Sirf category ka index rakha
settingSchema.index({ category: 1 });

// ❌ YEH LINE DELETE KARO - Duplicate hai kyunki key field mein unique: true already index banata hai
// settingSchema.index({ key: 1 });  // ← ISSE REMOVE KARO

export const Setting = mongoose.model('Setting', settingSchema);