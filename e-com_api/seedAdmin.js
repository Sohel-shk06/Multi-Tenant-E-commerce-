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



import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Store } from './models/Store.js';
import { config } from './config/env.js';

dotenv.config();

const seedVendor = async () => {
  try {
    // 1. Database connect karein
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Database connected successfully.');

    // 2. Vendor details
    const vendorData = {
      name: 'TechStore Pro',
      email: 'vendor@marketplace.com',
      password: 'vendor@12345',
      role: 'vendor',
      isVerified: true,
      status: 'active'
    };

    // 3. Check karein ki vendor pehle se exist toh nahi karta
    let vendor = await User.findOne({ email: vendorData.email });
    
    if (vendor) {
      console.log('⚠️  Vendor already exists!');
      console.log(`📧 Email: ${vendor.email}`);
      console.log('🔑 Password: vendor@12345');
    } else {
      // 4. Naya Vendor create karein
      vendor = await User.create(vendorData);
      console.log('🎉 Vendor account created successfully!');
    }

    // 5. Vendor ka Store create karein (agar nahi hai)
    let store = await Store.findOne({ vendor: vendor._id });
    
    if (!store) {
      store = await Store.create({
        name: 'TechStore Pro Official',
        slug: 'techstore-pro',
        description: 'Premium electronics and gadgets store',
        vendor: vendor._id,
        status: 'active',
        isActive: true
      });
      console.log('🏪 Vendor store created successfully!');
    } else {
      console.log('⚠️  Vendor store already exists!');
    }

    console.log('\n===========================================');
    console.log('📋 VENDOR CREDENTIALS:');
    console.log('===========================================');
    console.log(`📧 Email:    vendor@marketplace.com`);
    console.log(`🔑 Password: vendor@12345`);
    console.log(`🏪 Store ID: ${store._id}`);
    console.log(`👤 Vendor ID: ${vendor._id}`);
    console.log('===========================================\n');
    
    console.log('💡 TIP: Product create karte time ye Store ID use karein!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding vendor:', error.message);
    process.exit(1);
  }
};

seedVendor();