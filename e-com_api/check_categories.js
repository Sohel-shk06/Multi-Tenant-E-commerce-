import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './models/Category.js';

dotenv.config();

async function run() {
    try {
        console.log("Connecting to database using MONGO_URI in .env...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!\n");

        console.log("Fetching categories from database...");
        const categories = await Category.find({});
        
        console.log(`\nFound ${categories.length} categories:\n`);
        categories.forEach((c, idx) => {
            console.log(`${idx + 1}. Name: "${c.name}" (ID: ${c._id})`);
            console.log(`   Slug: ${c.slug}`);
            console.log(`   Image: ${c.image || 'None'}`);
            console.log(`   Description: ${c.description || 'None'}`);
            console.log(`   Active: ${c.isActive}`);
            console.log('');
        });
        
    } catch (err) {
        console.error("Error connecting or fetching data:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
