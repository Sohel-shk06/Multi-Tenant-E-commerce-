import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'basic', 'pro'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);