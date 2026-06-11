import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Size", "Color"
  value: { type: String, required: true }, // e.g., "XL", "Red"
  price: { type: Number, default: 0 }, // Price override for this variant
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true, sparse: true }
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative']
  },
  comparePrice: { 
    type: Number, 
    min: [0, 'Compare price cannot be negative'],
    default: 0
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: [true, 'Category is required']
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store',
    required: true
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  variants: [variantSchema],
  tags: [{ type: String, trim: true }],
  stock: { 
    type: Number, 
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  sku: { 
    type: String, 
    unique: true,
    sparse: true
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive'],
    default: 'draft'
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Auto-generate slug from title
productSchema.pre('save', function() {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

export const Product = mongoose.model('Product', productSchema);