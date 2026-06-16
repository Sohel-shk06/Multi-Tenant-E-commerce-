import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  title: { type: String, required: true },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative']
  },
  variant: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true 
    // ✅ required: true HATA DIYA - pre-save hook auto-generate karega
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    // ✅ required: true HATA DIYA - backend store se fetch karega
  },
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store',
    required: true 
  },
  items: [orderItemSchema],
  subtotal: { 
    type: Number, 
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: { 
    type: Number, 
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  shippingCost: { 
    type: Number, 
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  discount: { 
    type: Number, 
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'cod', 'upi', 'netbanking'],
    default: 'cod'  // ✅ Default cod rakha
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  trackingNumber: { 
    type: String, 
    default: '' 
  },
  notes: { 
    type: String, 
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  cancelledAt: { type: Date },
  completedAt: { type: Date },
  deliveredAt: { type: Date }
}, { timestamps: true });

// ✅ FIXED: Mongoose v8+ - next parameter nahi chahiye
orderSchema.pre('save', async function() {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      const timestamp = Date.now();
      const sequence = String(count + 1).padStart(4, '0');
      this.orderNumber = `ORD-${timestamp}-${sequence}`;
      console.log('✅ Auto-generated order number:', this.orderNumber);
    } catch (error) {
      console.error('Error generating order number:', error);
      // Fallback: simple random number
      this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
  }
  // ✅ next() call nahi karna - async function automatically handle karega
});

export const Order = mongoose.model('Order', orderSchema);