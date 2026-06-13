import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  vendorReply: {
  type: String,
  maxlength: [500, 'Reply cannot exceed 500 characters']
},
vendorReplyAt: {
  type: Date
},
  images: [{
    url: String,
    publicId: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, { timestamps: true });

// ✅ Ek customer ek product par sirf ek review de sakta hai
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

// ✅ Product ka average rating update karo
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: this.product, status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  }
});

// ✅ Review delete hone par bhi average update karo
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Product = mongoose.model('Product');
    const stats = await mongoose.model('Review').aggregate([
      { $match: { product: doc.product, status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    const updateData = stats.length > 0 
      ? { averageRating: Math.round(stats[0].avgRating * 10) / 10, totalReviews: stats[0].count }
      : { averageRating: 0, totalReviews: 0 };
    
    await Product.findByIdAndUpdate(doc.product, updateData);
  }
});

export const Review = mongoose.model('Review', reviewSchema);