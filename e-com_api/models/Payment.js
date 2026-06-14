// import mongoose from 'mongoose';

// const payoutSchema = new mongoose.Schema({
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: [1, 'Amount must be greater than 0']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processed', 'failed', 'rejected'],
//     default: 'pending'
//   },
//   requestedAt: {
//     type: Date,
//     default: Date.now
//   },
//   processedAt: {
//     type: Date
//   },
//   notes: {
//     type: String,
//     maxlength: [500, 'Notes cannot exceed 500 characters']
//   },
//   adminNotes: {
//     type: String,
//     maxlength: [500, 'Admin notes cannot exceed 500 characters']
//   }
// }, { timestamps: true });

// export const Payment = mongoose.model('Payment', payoutSchema);



// ✅ models/Payment.js (Correct Schema)
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Jis vendor ka order hai
  },
  transactionId: {
    type: String,
    required: true,
    unique: true // Razorpay/Stripe/PhonePe transaction ID
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than 0']
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod', 'netbanking', 'wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Payment gateway ka full response yahan save karein
  },
  paidAt: {
    type: Date
  }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);