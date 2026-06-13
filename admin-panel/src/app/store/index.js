import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import analyticsReducer from './analyticsSlice';
import vendorReducer from './vendorSlice';
import categoryReducer from './categorySlice'; 
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import storeReducer from './storeSlice';
import paymentReducer from './paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analytics: analyticsReducer,
    vendors: vendorReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    stores: storeReducer,
    payments: paymentReducer,
    // Baaki slices (vendor, product, etc.) baad mein yahan add honge
  },
});

// Ye line add karein taaki default import kaam kare
export default store; 