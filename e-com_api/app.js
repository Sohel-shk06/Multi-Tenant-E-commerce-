import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import vendorRoutes from './routes/vendor.routes.js'; // ✅ Add this
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import storeRoutes from './routes/store.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewRoutes from './routes/review.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import paymentRoutes from './routes/payment.routes.js';
import commissionRoutes from './routes/commission.routes.js';
import disputeRoutes from './routes/dispute.routes.js';
import settingRoutes from './routes/setting.routes.js';


const app = express();

// CORS Configuration (Multiple origins)
const allowedOrigins = [
  'http://localhost:5173',  // admin-panel
  'http://localhost:5174',  // e-com (customer/vendor frontend)
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vendors', vendorRoutes); // ✅ Add this (Admin vendor management)
app.use('/api/vendor', vendorRoutes);  // ✅ Add this (Vendor dashboard - same routes file)
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/settings', settingRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Server is running' }));

// Global Error Handler
app.use(errorMiddleware);

export default app;