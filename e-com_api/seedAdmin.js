// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { User } from './models/User.js';
// import { config } from './config/env.js';

// // Load environment variables
// dotenv.config();

// const seedAdmin = async () => {
//   try {
//     // 1. Database se connect karein
//     await mongoose.connect(config.MONGO_URI);
//     console.log('✅ Database connected successfully.');

//     // 2. Check karein ki admin pehle se exist toh nahi karta
//     const existingAdmin = await User.findOne({ role: 'admin' });
//     if (existingAdmin) {
//       console.log('⚠️ Admin account already exists!');
//       console.log(`Email: ${existingAdmin.email}`);
//       console.log('Password: admin@12345'); // Default password jo hum niche set kar rahe hain
//       process.exit(0);
//     }

//     // 3. Naya Admin account create karein
//     // Note: User model ka pre-save hook automatically password ko bcrypt se hash kar dega
//     const adminData = {
//       name: 'Super Admin',
//       email: 'admin@marketplace.com',
//       password: 'admin@12345', // Ye password automatically hash ho jayega
//       role: 'admin',
//       isVerified: true // Admin ko email verify karne ki zaroorat nahi hoti
//     };

//     const newAdmin = await User.create(adminData);
//     console.log('🎉 Super Admin account created successfully!');
//     console.log('---------------------------------------------------');
//     console.log('📧 Email: admin@marketplace.com');
//     console.log('🔑 Password: admin@12345');
//     console.log('---------------------------------------------------');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error creating admin account:', error.message);
//     process.exit(1);
//   }
// };

// seedAdmin();


// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { Order } from './models/Order.js';
// import { Payment } from './models/Payment.js';

// dotenv.config();

// const fixPendingPayments = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ Connected to MongoDB\n');

//     // Saare delivered/completed orders dhundhein jinki payment pending hai
//     const orders = await Order.find({
//       status: { $in: ['delivered', 'completed'] },
//       paymentStatus: 'pending',
//       paymentMethod: 'cod'
//     });

//     console.log(`🔍 Found ${orders.length} orders with pending payment\n`);

//     let fixed = 0;

//     for (const order of orders) {
//       console.log(`\n📦 Processing order: ${order.orderNumber}`);

//       // Payment document dhundhein
//       let payment = await Payment.findOne({ order: order._id });

//       if (payment) {
//         // Payment document hai, update karein
//         payment.paymentStatus = 'paid';
//         payment.paidAt = order.deliveredAt || order.completedAt || new Date();
//         payment.gatewayResponse = {
//           source: 'cod-delivery-fixed',
//           note: 'Fixed by script - payment collected on delivery',
//           fixedAt: new Date()
//         };
//         await payment.save();
//         console.log('✅ Payment document updated to PAID');
//       } else {
//         // Payment document nahi hai, create karein
//         payment = await Payment.create({
//           order: order._id,
//           customer: order.customer,
//           vendor: order.vendor,
//           transactionId: `TXN-${order._id.toString().slice(-8)}-${Date.now()}`,
//           amount: order.totalAmount,
//           paymentMethod: 'cod',
//           paymentStatus: 'paid',
//           paidAt: order.deliveredAt || order.completedAt || new Date(),
//           gatewayResponse: {
//             source: 'cod-delivery-created',
//             note: 'Created by script - payment collected on delivery'
//           }
//         });
//         console.log('✅ New Payment document created with status PAID');
//       }

//       // Order ka paymentStatus bhi update karein
//       order.paymentStatus = 'paid';
//       await order.save();
//       console.log('✅ Order paymentStatus updated to PAID');

//       fixed++;
//     }

//     console.log(`\n🎉 Done! Fixed ${fixed} orders.`);
//     console.log('✅ Ab admin panel refresh karein - sab paid dikh jayega!\n');

//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     console.error('❌ Stack:', error.stack);
//     process.exit(1);
//   }
// };

// fixPendingPayments();



import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Setting } from './models/Setting.js';

dotenv.config();

const defaultSettings = [
  // ===== GENERAL SETTINGS =====
  { key: 'platformName', value: 'Multi-Tenant Marketplace', category: 'general' },
  { key: 'platformLogo', value: '', category: 'general' },
  { key: 'supportEmail', value: 'support@marketplace.com', category: 'general' },
  { key: 'contactPhone', value: '+91-XXXXXXXXXX', category: 'general' },
  { key: 'platformAddress', value: '', category: 'general' },
  { key: 'timezone', value: 'Asia/Kolkata', category: 'general' },
  { key: 'currency', value: 'INR', category: 'general' },
  { key: 'language', value: 'en', category: 'general' },

  // ===== SECURITY SETTINGS =====
  { key: 'jwtExpiry', value: '7d', category: 'security' },
  { key: 'passwordMinLength', value: 8, category: 'security' },
  { key: 'requireUppercase', value: true, category: 'security' },
  { key: 'requireNumber', value: true, category: 'security' },
  { key: 'requireSpecialChar', value: false, category: 'security' },
  { key: 'twoFactorAuth', value: false, category: 'security' },
  { key: 'loginAttempts', value: 5, category: 'security' },
  { key: 'lockoutDuration', value: 15, category: 'security' },
  { key: 'sessionTimeout', value: 60, category: 'security' },

  // ===== COMMISSION SETTINGS =====
  { key: 'globalCommissionRate', value: 10, category: 'commission' },
  { key: 'commissionType', value: 'percentage', category: 'commission' },
  { key: 'minimumOrderForCommission', value: 0, category: 'commission' },
  { key: 'autoCollectCommission', value: false, category: 'commission' },

  // ===== PAYMENT SETTINGS =====
  { key: 'stripeEnabled', value: false, category: 'payment' },
  { key: 'stripePublishableKey', value: '', category: 'payment' },
  { key: 'stripeSecretKey', value: '', category: 'payment' },
  { key: 'razorpayEnabled', value: false, category: 'payment' },
  { key: 'razorpayKeyId', value: '', category: 'payment' },
  { key: 'razorpayKeySecret', value: '', category: 'payment' },
  { key: 'codEnabled', value: true, category: 'payment' },
  { key: 'minOrderAmount', value: 100, category: 'payment' },
  { key: 'maxOrderAmount', value: 100000, category: 'payment' },

  // ===== EMAIL SETTINGS =====
  { key: 'smtpHost', value: '', category: 'email' },
  { key: 'smtpPort', value: 587, category: 'email' },
  { key: 'smtpUser', value: '', category: 'email' },
  { key: 'smtpPassword', value: '', category: 'email' },
  { key: 'smtpSecure', value: true, category: 'email' },
  { key: 'fromEmail', value: 'noreply@marketplace.com', category: 'email' },
  { key: 'fromName', value: 'Marketplace', category: 'email' },

  // ===== NOTIFICATION SETTINGS =====
  { key: 'emailNewOrder', value: true, category: 'notification' },
  { key: 'emailOrderShipped', value: true, category: 'notification' },
  { key: 'emailOrderDelivered', value: true, category: 'notification' },
  { key: 'emailNewReview', value: true, category: 'notification' },
  { key: 'emailNewVendor', value: true, category: 'notification' },
  { key: 'inAppNotifications', value: true, category: 'notification' },
  { key: 'pushNotifications', value: false, category: 'notification' },

  // ===== STORAGE SETTINGS =====
  { key: 'cloudinaryCloudName', value: '', category: 'storage' },
  { key: 'cloudinaryApiKey', value: '', category: 'storage' },
  { key: 'cloudinaryApiSecret', value: '', category: 'storage' },
  { key: 'maxImageSize', value: 5, category: 'storage' },
  { key: 'maxImagesPerProduct', value: 10, category: 'storage' },
  { key: 'allowedFileTypes', value: ['image/jpeg', 'image/png', 'image/webp'], category: 'storage' },

  // ===== SYSTEM SETTINGS =====
  { key: 'maintenanceMode', value: false, category: 'system' },
  { key: 'maintenanceMessage', value: 'We are currently under maintenance. Please check back later.', category: 'system' },
  { key: 'registrationEnabled', value: true, category: 'system' },
  { key: 'vendorRegistrationEnabled', value: true, category: 'system' },
  { key: 'autoApproveVendors', value: false, category: 'system' },
  { key: 'autoApproveProducts', value: false, category: 'system' },
  { key: 'cacheEnabled', value: true, category: 'system' },
  { key: 'debugMode', value: false, category: 'system' }
];

const seedSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let created = 0;
    let skipped = 0;

    for (const setting of defaultSettings) {
      const existing = await Setting.findOne({ key: setting.key });
      if (existing) {
        skipped++;
        continue;
      }

      await Setting.create(setting);
      console.log(`✅ Created: ${setting.key}`);
      created++;
    }

    console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedSettings();