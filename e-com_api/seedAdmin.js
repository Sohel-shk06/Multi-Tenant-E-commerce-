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

