import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 0.10 // 10%
  },
  commissionAmount: {
    type: Number,
    required: true
  },
  vendorAmount: {
    type: Number,
    required: true // orderAmount - commissionAmount
  },
  status: {
    type: String,
    enum: ['pending', 'earned', 'collected', 'refunded'],
    default: 'pending'
  },
  collectedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, { timestamps: true });

// Index for faster queries
commissionSchema.index({ vendor: 1, status: 1 });
commissionSchema.index({ order: 1 });
commissionSchema.index({ createdAt: -1 });

export const Commission = mongoose.model('Commission', commissionSchema);