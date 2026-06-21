import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { Store } from './models/Store.js';
import { config } from './config/env.js';

// Load env
dotenv.config();

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary credentials found. Images will be uploaded to Cloudinary.');
} else {
  console.log('⚠️ Cloudinary credentials not configured or placeholder. Falling back to local public image paths.');
}

async function uploadToCloudinary(filePath, folder = 'hero_banners') {
  try {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File does not exist: ${absolutePath}`);
    }
    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: `multi-tenant-ecommerce/${folder}`,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Cloudinary upload failed for ${filePath}:`, error.message);
    return null;
  }
}

async function run() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB at:', config.MONGO_URI);
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Database connected.');

    // Image locations
    const electronicsBannerLocal = '../e-com/public/store_banner_electronics.png';
    const carsBannerLocal = '../e-com/public/store_banner_cars.png';
    const booksBannerLocal = '../e-com/public/store_banner_books.png';
    const defaultBannerLocal = '../e-com/public/store_banner_default.png';

    let electronicsBannerUrl = '/store_banner_electronics.png';
    let carsBannerUrl = '/store_banner_cars.png';
    let booksBannerUrl = '/store_banner_books.png';
    let defaultBannerUrl = '/store_banner_default.png';

    // 1. Upload store banners to Cloudinary if keys exist
    if (isCloudinaryConfigured) {
      console.log('\nUploading store banners to Cloudinary...');
      const elecCloudUrl = await uploadToCloudinary(electronicsBannerLocal, 'store_banners');
      if (elecCloudUrl) electronicsBannerUrl = elecCloudUrl;

      const carsCloudUrl = await uploadToCloudinary(carsBannerLocal, 'store_banners');
      if (carsCloudUrl) carsBannerUrl = carsCloudUrl;

      const booksCloudUrl = await uploadToCloudinary(booksBannerLocal, 'store_banners');
      if (booksCloudUrl) booksBannerUrl = booksCloudUrl;

      const defCloudUrl = await uploadToCloudinary(defaultBannerLocal, 'store_banners');
      if (defCloudUrl) defaultBannerUrl = defCloudUrl;

      // Also upload hero banners to show Cloudinary URLs
      console.log('\nUploading hero banners to Cloudinary...');
      const heroShoe = await uploadToCloudinary('../e-com/public/hero_banner_wide.png', 'hero_banners');
      const heroFashion = await uploadToCloudinary('../e-com/public/hero_fashion_new_wide.png', 'hero_banners');
      const heroBeauty = await uploadToCloudinary('../e-com/public/hero_beauty_new_wide.png', 'hero_banners');

      console.log('\n--- Cloudinary Hero Banner Links (Copy to Home.jsx if needed) ---');
      console.log(`Slide 1 (Shoe): ${heroShoe || 'Upload failed'}`);
      console.log(`Slide 2 (Fashion): ${heroFashion || 'Upload failed'}`);
      console.log(`Slide 3 (Beauty): ${heroBeauty || 'Upload failed'}`);
      console.log('--------------------------------------------------------------\n');
    }

    // 2. Fetch and update stores in DB
    const stores = await Store.find({});
    console.log(`Found ${stores.length} store(s) in database.`);

    for (const store of stores) {
      const nameLower = store.name.toLowerCase();
      let updatedBanner = '';
      
      if (nameLower.includes('voltix') || nameLower.includes('electronics') || nameLower.includes('tech')) {
        updatedBanner = electronicsBannerUrl;
        console.log(`Updating store "${store.name}" with Electronics banner.`);
      } else if (nameLower.includes('cars') || nameLower.includes('car') || nameLower.includes('vehicle')) {
        updatedBanner = carsBannerUrl;
        console.log(`Updating store "${store.name}" with Cars banner.`);
      } else if (nameLower.includes('book') || nameLower.includes('books') || nameLower.includes('library')) {
        updatedBanner = booksBannerUrl;
        console.log(`Updating store "${store.name}" with Books banner.`);
      } else {
        updatedBanner = defaultBannerUrl;
        console.log(`Updating store "${store.name}" with Default store banner.`);
      }

      store.banner = updatedBanner;
      await store.save();
    }

    console.log('\n✅ Database migration completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

run();
