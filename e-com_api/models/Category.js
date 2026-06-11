import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: { 
    type: String, 
    default: ''
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, { timestamps: true });

// 🔥 FIX: Mongoose v9+ mein async function mein 'next' pass nahi hota
// Hum sirf return use karenge, next() ki zaroorat nahi
categorySchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export const Category = mongoose.model('Category', categorySchema);