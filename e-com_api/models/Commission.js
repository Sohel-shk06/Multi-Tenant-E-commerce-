import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

export const Commission = mongoose.model('Commission', commissionSchema);