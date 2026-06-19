import { createSlice } from '@reduxjs/toolkit';

// LocalStorage se cart load karna
const loadCart = () => {
  try {
    const serialized = localStorage.getItem('cart');
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const loadWishlist = () => {
  try {
    const serialized = localStorage.getItem('wishlist');
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadCart(),
  wishlist: loadWishlist(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.productId === product.productId);
      
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.items.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = Math.max(1, quantity); // Minimum quantity 1
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.wishlist.find(item => item.productId === product.productId);
      
      if (exists) {
        state.wishlist = state.wishlist.filter(item => item.productId !== product.productId);
      } else {
        state.wishlist.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
    
    clearWishlist: (state) => {
      state.wishlist = [];
      localStorage.removeItem('wishlist');
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, clearWishlist } = cartSlice.actions;
export default cartSlice.reducer;