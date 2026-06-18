import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';

dotenv.config();

async function run() {
    try {
        console.log("Connecting to database using MONGO_URI in .env...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!\n");

        console.log("Fetching products from database...");
        const products = await Product.find({}, 'title images').limit(10);
        
        console.log(`\nFound ${products.length} products:\n`);
        products.forEach((p, idx) => {
            console.log(`${idx + 1}. Title: "${p.title}"`);
            if (p.images && p.images.length > 0) {
                console.log(`   Image Link: ${p.images[0].url}`);
            } else {
                console.log(`   Image Link: No image URL found.`);
            }
            console.log('');
        });
        
    } catch (err) {
        console.error("Error connecting or fetching data:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
