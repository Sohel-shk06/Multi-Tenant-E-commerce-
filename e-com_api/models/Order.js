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
    required: true, 
    unique: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
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
    default: 'stripe'
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

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);