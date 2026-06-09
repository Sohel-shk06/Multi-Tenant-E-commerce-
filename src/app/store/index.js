import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

/**
 * Redux store configuration.
 * TODO: Add remaining slices as their modules are implemented.
 * TODO: Add redux-persist when auth/session persistence is needed.
 */
const store = configureStore({
  reducer: {
    cart: cartReducer,
    // auth: authReducer,
    // products: productReducer,
    // orders: orderReducer,
    // wishlist: wishlistReducer,
    // notifications: notificationReducer,
  },
})

export default store
