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
import { Dispute } from './models/Dispute.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';

dotenv.config();

const seedDisputes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Ek Customer aur Vendor dhundho
    const customer = await User.findOne({ role: 'customer' });
    const vendor = await User.findOne({ role: 'vendor' });

    if (!customer || !vendor) {
      console.log('❌ Error: Pehle database mein kam se kam 1 Customer aur 1 Vendor create karo.');
      process.exit(1);
    }

    // 2. Existing orders dhundho (jinpe dispute raise ho sake)
    const orders = await Order.find({}).limit(5);

    if (orders.length === 0) {
      console.log('⚠️  Database mein koi Order nahi mila.');
      console.log('💡 Pehle customer account se 1-2 test orders place karo, phir yeh script run karo.');
      process.exit(0);
    }

    console.log(`🔍 Found ${orders.length} orders. Creating test disputes...\n`);

    // 3. Test Disputes ka data
    const disputeTemplates = [
      {
        subject: 'Product damaged during delivery',
        reason: 'product_damaged',
        description: 'The product box was completely crushed and the item inside is broken. I need a replacement or full refund.',
        priority: 'high',
        status: 'open'
      },
      {
        subject: 'Received wrong product variant',
        reason: 'wrong_product',
        description: 'I ordered a Blue color variant, but I received a Red one. Please arrange a pickup and send the correct item.',
        priority: 'medium',
        status: 'under_review'
      },
      {
        subject: 'Order delivered but item missing',
        reason: 'product_not_received',
        description: 'The tracking shows delivered, but the package was empty. The delivery boy handed over an empty box.',
        priority: 'urgent',
        status: 'vendor_responded'
      },
      {
        subject: 'Poor quality material',
        reason: 'quality_issue',
        description: 'The material quality is very poor and does not match the product description on the website.',
        priority: 'low',
        status: 'resolved_customer'
      },
      {
        subject: 'Late delivery beyond promised date',
        reason: 'late_delivery',
        description: 'The order was promised in 3 days but it took 10 days to arrive. I want compensation for the delay.',
        priority: 'medium',
        status: 'closed'
      }
    ];

    let createdCount = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const template = disputeTemplates[i % disputeTemplates.length];

      // Check karo ki is order pe pehle se dispute toh nahi hai
      const existingDispute = await Dispute.findOne({ order: order._id });
      if (existingDispute) {
        console.log(`⏭️  Dispute already exists for Order: ${order.orderNumber}`);
        continue;
      }

      // Naya dispute create karo
      await Dispute.create({
        order: order._id,
        raisedBy: customer._id,
        vendor: order.vendor || vendor._id,
        customer: customer._id,
        subject: template.subject,
        reason: template.reason,
        description: template.description,
        priority: template.priority,
        status: template.status,
        openedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Purane dates ke liye
        messages: [
          {
            sender: customer._id,
            senderRole: 'customer',
            message: template.description,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          }
        ]
      });

      console.log(`✅ Dispute created [${template.status.toUpperCase()}] for Order: ${order.orderNumber}`);
      createdCount++;
    }

    console.log(`\n🎉 Success! Created ${createdCount} test disputes.`);
    console.log('✅ Ab Admin Panel refresh karo (Ctrl + Shift + R) - Numbers dikhne lagenge!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding disputes:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
    }
};

seedDisputes();