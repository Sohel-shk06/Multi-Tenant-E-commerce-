import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  logo: { 
    type: String, 
    default: '' // Cloudinary URL
  },
  banner: { 
    type: String, 
    default: '' // Cloudinary URL
  },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'closed'],
    default: 'active'
  },
  settings: {
    currency: { type: String, default: 'INR' },
    shippingZones: [{ type: String }],
    returnPolicy: { type: String, default: '7 days return policy' },
    contactEmail: { type: String },
    contactPhone: { type: String }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Auto-generate slug from name
storeSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export const Store = mongoose.model('Store', storeSchema);