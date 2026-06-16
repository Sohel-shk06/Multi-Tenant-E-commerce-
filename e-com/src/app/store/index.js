import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import vendorDashboardReducer from './vendorDashboardSlice'; 
import vendorProductReducer from './vendorProductSlice';
import vendorStoreReducer from './vendorStoreSlice';
import vendorOrderReducer from './vendorOrderSlice';
import cartReducer from './cartSlice';
// Baaki slices baad mein add honge (e.g., productReducer, cartReducer)

export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Ye line zaroor honi chahiye
    vendorDashboard: vendorDashboardReducer,
    vendorProducts: vendorProductReducer,
    vendorStores: vendorStoreReducer,
    vendorOrders: vendorOrderReducer,
    cart: cartReducer,
  },
});

export default store;