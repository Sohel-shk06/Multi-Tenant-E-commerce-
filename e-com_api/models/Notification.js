import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order_update', 'promo', 'security'],
    default: 'order_update'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
