import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  attachments: [{
    url: String,
    publicId: String
  }]
}, { timestamps: true });

const disputeSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  reason: {
    type: String,
    enum: [
      'product_not_received',
      'product_damaged',
      'wrong_product',
      'quality_issue',
      'refund_not_received',
      'late_delivery',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  evidence: [{
    url: String,
    publicId: String,
    type: { type: String, enum: ['image', 'document'] }
  }],
  status: {
    type: String,
    enum: ['open', 'under_review', 'vendor_responded', 'resolved_customer', 'resolved_vendor', 'closed'],
    default: 'open'
  },
  resolution: {
    type: String,
    enum: ['full_refund', 'partial_refund', 'replacement', 'rejected', 'none'],
    default: 'none'
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  messages: [messageSchema],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  openedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Indexes for faster queries
disputeSchema.index({ status: 1, createdAt: -1 });
disputeSchema.index({ vendor: 1 });
disputeSchema.index({ customer: 1 });
disputeSchema.index({ order: 1 });

export const Dispute = mongoose.model('Dispute', disputeSchema);